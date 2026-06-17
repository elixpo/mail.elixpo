export const runtime = "edge";

import HistoryIcon from "@mui/icons-material/History";
import { Box } from "@mui/material";
import { EmptyState, PageHeader } from "../../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

export default async function LogsPage() {
    await requireDashboardSession();
    return (
        <Box>
            <PageHeader
                title="Delivery logs"
                description="Every triggered send is recorded with its status, recipient, and the variables that were merged in."
            />
            <EmptyState
                icon={HistoryIcon}
                accent="#fbbf24"
                headline="No sends yet"
                subtext="Once you trigger a webhook, each delivery will be logged here — searchable by recipient, template, and status."
            />
        </Box>
    );
}
