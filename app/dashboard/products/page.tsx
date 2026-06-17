export const runtime = "edge";

import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2";
import { Box } from "@mui/material";
import { ActionButton, EmptyState, PageHeader } from "../../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

export default async function ProductsPage() {
    await requireDashboardSession();
    return (
        <Box>
            <PageHeader
                title="Products"
                description="A product groups your templates under one client ID and shared secret, HMAC-verified on every send."
                action={<ActionButton label="New product" icon={AddIcon} comingSoon />}
            />
            <EmptyState
                icon={InventoryIcon}
                accent="#9b7bf7"
                headline="No products yet"
                subtext="Create your first product to mint a client ID and secret, then attach templates and webhooks to it."
                cta={<ActionButton label="New product" icon={AddIcon} comingSoon />}
            />
        </Box>
    );
}
