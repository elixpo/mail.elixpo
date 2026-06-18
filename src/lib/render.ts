/**
 * Template → email rendering. Two jobs:
 *   1. Substitute {{variables}} into the subject and body.
 *   2. Wrap the editor's HTML in an email-safe document (light background,
 *      table-based container, structural styles inlined + a <style> block for
 *      content tags that Gmail/Apple/Outlook-web honor).
 *
 * Web HTML breaks in mail clients (gotcha #5). This is the v1 email shell;
 * a full CSS inliner pass can harden it later for legacy Outlook.
 *
 * Pure + edge-safe (no DOM) so it runs in a Pages route or the sender Worker.
 */

import { substituteVariables } from "./template-vars";

export interface RenderableTemplate {
    subject: string;
    content_html: string | null;
}

export interface RenderedEmail {
    subject: string;
    html: string;
    text: string;
}

export function renderTemplate(
    template: RenderableTemplate,
    vars: Record<string, any> = {},
): RenderedEmail {
    const subject = substituteVariables(template.subject || "", vars);
    const content = substituteVariables(template.content_html || "", vars);
    return {
        subject,
        html: wrapEmailHtml(content),
        text: htmlToText(content),
    };
}

/** Wrap rendered content in a responsive, email-client-safe HTML document. */
export function wrapEmailHtml(content: string): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<style>
  body { margin:0; padding:0; background:#f4f4f7; -webkit-text-size-adjust:100%; }
  .e-content { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1a1a1a; font-size:16px; line-height:1.6; }
  .e-content p { margin:0 0 16px; }
  .e-content h1 { font-size:26px; line-height:1.25; margin:0 0 16px; }
  .e-content h2 { font-size:21px; margin:24px 0 12px; }
  .e-content h3 { font-size:18px; margin:20px 0 10px; }
  .e-content a { color:#7c5cff; text-decoration:underline; }
  .e-content img { max-width:100%; height:auto; border-radius:8px; }
  .e-content ul, .e-content ol { margin:0 0 16px; padding-left:22px; }
  .e-content li { margin:0 0 6px; }
  .e-content hr { border:none; border-top:1px solid #e5e7eb; margin:24px 0; }
  .e-content blockquote { margin:0 0 16px; padding:8px 16px; border-left:3px solid #d8d3f0; color:#555; }
  .e-content pre { background:#0b0d12; color:#e5e7eb; padding:14px; border-radius:8px; overflow:auto; font-size:13px; }
  .e-content code { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:0.9em; }
</style>
</head>
<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td class="e-content" style="padding:32px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;font-size:16px;line-height:1.6;">
${content || "<p style=\"color:#9aa0a6\">(empty)</p>"}
</td></tr>
<tr><td style="padding:16px 32px 28px;color:#9aa0a6;font-size:12px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
Sent with Elixpo Mails
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Cheap HTML → plain-text fallback for the multipart/alternative text part. */
export function htmlToText(html: string): string {
    return html
        .replace(/<\s*(br|\/p|\/div|\/h[1-6]|\/li)\s*>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .split("\n")
        .map((l) => l.trim())
        .join("\n")
        .trim();
}
