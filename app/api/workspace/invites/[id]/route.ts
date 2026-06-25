export const runtime = "edge";

import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1-client";
import { guard } from "@/lib/workspace-guard";
import { revokeInvite } from "@/lib/workspace";

/** DELETE /api/workspace/invites/[id] — revoke a pending invite (admin+). */
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const g = await guard(request, "admin");
    if (!g.ok) return g.response;
    const { id } = await ctx.params;

    const db = await getDatabase();
    await revokeInvite(db, g.session.tenantId, id);
    return NextResponse.json({ ok: true });
}
