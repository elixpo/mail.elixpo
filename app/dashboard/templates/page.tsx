export const runtime = "edge";

import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import { Box } from "@mui/material";
import { ActionButton, EmptyState, PageHeader } from "../../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

export default async function TemplatesPage() {
    await requireDashboardSession();
    return (
        <Box>
            <PageHeader
                title="Templates"
                description="Design transactional emails with {{variables}} in a visual editor. Each template has exactly one webhook trigger."
                action={<ActionButton label="New template" icon={AddIcon} comingSoon />}
            />
            <EmptyState
                icon={DescriptionIcon}
                accent="#86efac"
                headline="No templates yet"
                subtext="Compose your first template with placeholder variables and a live preview, then bind it to a webhook to start sending."
                cta={<ActionButton label="New template" icon={AddIcon} comingSoon />}
            />
        </Box>
    );
}
