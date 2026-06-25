export const runtime = "edge";

import { getDatabase } from "@/lib/d1-client";
import { revokeInvite } from "@/lib/workspace";
import { guard } from "@/lib/workspace-guard";
import { type NextRequest, NextResponse } from "next/server";

/** DELETE /api/workspace/invites/[id] — revoke a pending invite (admin+). */
export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const g = await guard(request, "admin");
    if (!g.ok) return g.response;
    const { id } = await ctx.params;

    const db = await getDatabase();
    await revokeInvite(db, g.session.tenantId, id);
    return NextResponse.json({ ok: true });
}
