export const runtime = "edge";

import { getDatabase } from "@/lib/d1-client";
import { type Role, createInvite, inviteToPublic, normalizeRole } from "@/lib/workspace";
import { guard } from "@/lib/workspace-guard";
import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/workspace/invites — create an invite link (admin+).
 * Body: { email?, role }. Omit email for an open join-request link.
 * Returns the invite incl. its shareable URL.
 */
export async function POST(request: NextRequest) {
    const g = await guard(request, "admin");
    if (!g.ok) return g.response;

    let body: { email?: string; role?: string };
    try {
        body = (await request.json()) as typeof body;
    } catch {
        return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const role = normalizeRole(body.role) as Role;
    if (role === "owner") {
        return NextResponse.json({ error: "cannot_invite_owner" }, { status: 400 });
    }

    const db = await getDatabase();
    const invite = await createInvite(db, g.session.tenantId, {
        email: body.email?.trim() || null,
        role,
        invitedBy: g.session.uid,
    });

    const url = `${request.nextUrl.origin}/join/${invite.token}`;
    return NextResponse.json({ ok: true, invite: { ...inviteToPublic(invite), url } });
}
