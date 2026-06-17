// SMTP-over-sockets client for the Cloudflare Workers runtime.
// Promoted from spike/smtp-edge after it proved an authenticated Gmail send
// works over cloudflare:sockets. Supports implicit TLS (port 465, secure:"tls")
// and STARTTLS (port 587, secure:"starttls"). Returns a wire transcript for
// debugging (credentials redacted).

import { connect } from "cloudflare:sockets";

const enc = new TextEncoder();
const dec = new TextDecoder();

export async function sendMail(opts) {
    const {
        host,
        port = 465,
        secure = "tls", // "tls" (implicit) | "starttls"
        user,
        pass,
        from,
        fromName,
        to,
        subject = "",
        html,
        text,
    } = opts;

    const transcript = [];
    const starttls = secure === "starttls";

    const socket = connect(
        { hostname: host, port: Number(port) },
        starttls
            ? { secureTransport: "starttls", allowHalfOpen: false }
            : { secureTransport: "on", allowHalfOpen: false },
    );

    let writer = socket.writable.getWriter();
    let reader = socket.readable.getReader();
    let buf = "";

    async function read() {
        while (true) {
            const at = completeReply(buf);
            if (at >= 0) {
                const reply = buf.slice(0, at);
                buf = buf.slice(at);
                transcript.push("S: " + reply.trimEnd());
                return reply;
            }
            const { value, done } = await reader.read();
            if (done) {
                if (buf) {
                    transcript.push("S: " + buf.trimEnd());
                    return buf;
                }
                throw new Error("connection closed before reply completed");
            }
            buf += dec.decode(value, { stream: true });
        }
    }

    async function send(line, redact) {
        transcript.push("C: " + (redact ? "***" : line));
        await writer.write(enc.encode(line + "\r\n"));
    }

    function expect(reply, code) {
        if (reply.slice(0, 3) !== String(code)) {
            throw new Error(`expected ${code}, got: ${reply.trim()}`);
        }
    }

    try {
        expect(await read(), 220);
        await send(`EHLO mail.elixpo`);
        expect(await read(), 250);

        if (starttls) {
            await send("STARTTLS");
            expect(await read(), 220);
            // Upgrade the connection, then re-handshake on the secure channel.
            const secureSocket = socket.startTls();
            writer = secureSocket.writable.getWriter();
            reader = secureSocket.readable.getReader();
            buf = "";
            await send(`EHLO mail.elixpo`);
            expect(await read(), 250);
        }

        await send("AUTH LOGIN");
        expect(await read(), 334);
        await send(b64(user), true);
        expect(await read(), 334);
        await send(b64(pass), true);
        expect(await read(), 235);

        await send(`MAIL FROM:<${from}>`);
        expect(await read(), 250);
        await send(`RCPT TO:<${to}>`);
        expect(await read(), 250);

        await send("DATA");
        expect(await read(), 354);

        const message = buildMessage({ from, fromName, to, subject, html, text });
        await writer.write(enc.encode(message + "\r\n.\r\n"));
        transcript.push("C: <message body> + .");
        const queued = await read();
        expect(queued, 250);

        await send("QUIT");
        try {
            await read();
        } catch {
            /* some servers drop before 221 */
        }

        return { ok: true, response: queued.trim(), transcript };
    } finally {
        try {
            await writer.close();
        } catch {}
        try {
            reader.releaseLock();
        } catch {}
        try {
            await socket.close();
        } catch {}
    }
}

// Index just past the first complete reply, or -1.
function completeReply(s) {
    let i = 0;
    while (true) {
        const nl = s.indexOf("\n", i);
        if (nl < 0) return -1;
        const line = s.slice(i, nl);
        if (line.length >= 4 && line[3] === " ") return nl + 1;
        if (line.length === 3) return nl + 1;
        i = nl + 1;
    }
}

function buildMessage({ from, fromName, to, subject, html, text }) {
    const date = new Date().toUTCString();
    const fromHeader = fromName ? `${encodeHeaderWord(fromName)} <${from}>` : `<${from}>`;
    const headers = [
        `From: ${fromHeader}`,
        `To: <${to}>`,
        `Subject: ${encodeHeaderWord(subject)}`,
        `Date: ${date}`,
        `MIME-Version: 1.0`,
    ];

    let body;
    if (html && text) {
        const boundary = `=_mailelixpo_${randomToken()}`;
        headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
        body = [
            `--${boundary}`,
            `Content-Type: text/plain; charset=utf-8`,
            ``,
            dotStuff(text),
            `--${boundary}`,
            `Content-Type: text/html; charset=utf-8`,
            ``,
            dotStuff(html),
            `--${boundary}--`,
        ].join("\r\n");
    } else if (html) {
        headers.push(`Content-Type: text/html; charset=utf-8`);
        body = dotStuff(html);
    } else {
        headers.push(`Content-Type: text/plain; charset=utf-8`);
        body = dotStuff(text || "");
    }

    return headers.join("\r\n") + "\r\n\r\n" + body;
}

// RFC 5321 dot-stuffing: a line starting with "." must be escaped to "..".
function dotStuff(s) {
    return s.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..").replace(/^\./, "..");
}

// Encode a header value as RFC 2047 if it contains non-ASCII; else pass through.
function encodeHeaderWord(s) {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: ASCII range check
    if (/^[\x00-\x7F]*$/.test(s)) return s;
    return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}

function b64(s) {
    return btoa(unescape(encodeURIComponent(s)));
}

function randomToken() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}
