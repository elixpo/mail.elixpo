export const runtime = "edge";

import AddIcon from "@mui/icons-material/Add";
import DnsIcon from "@mui/icons-material/Dns";
import { Box } from "@mui/material";
import { ActionButton, EmptyState, PageHeader } from "../../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

export default async function SendersPage() {
    await requireDashboardSession();
    return (
        <Box>
            <PageHeader
                title="Senders"
                description="The mailboxes you send from — your email and app password, encrypted at rest and never returned. Each product has a default sender."
                action={<ActionButton label="Connect sender" icon={AddIcon} comingSoon />}
            />
            <EmptyState
                icon={DnsIcon}
                accent="#9b7bf7"
                headline="No senders connected"
                subtext="Connect a mailbox to send on your own domain and reputation. Templates can override the product's default sender."
                cta={<ActionButton label="Connect sender" icon={AddIcon} comingSoon />}
            />
        </Box>
    );
}
