export const runtime = "edge";

import AddIcon from "@mui/icons-material/Add";
import WebhookIcon from "@mui/icons-material/Webhook";
import { Box } from "@mui/material";
import { ActionButton, EmptyState, PageHeader } from "../../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

export default async function WebhooksPage() {
    await requireDashboardSession();
    return (
        <Box>
            <PageHeader
                title="Webhooks"
                description="Each template has exactly one user-named, HMAC-signed webhook. POST an event and we merge variables and send."
                action={<ActionButton label="New webhook" icon={AddIcon} comingSoon />}
            />
            <EmptyState
                icon={WebhookIcon}
                accent="#5fb6ff"
                headline="No webhooks yet"
                subtext="Create a template first, then add its webhook to get a signed endpoint you can trigger from your stack."
                cta={<ActionButton label="New webhook" icon={AddIcon} comingSoon />}
            />
        </Box>
    );
}
