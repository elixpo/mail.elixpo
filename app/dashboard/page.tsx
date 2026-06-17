export const runtime = "edge";

import type { SvgIconComponent } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionIcon from "@mui/icons-material/Description";
import DnsIcon from "@mui/icons-material/Dns";
import HistoryIcon from "@mui/icons-material/History";
import InsightsIcon from "@mui/icons-material/Insights";
import InventoryIcon from "@mui/icons-material/Inventory2";
import SendIcon from "@mui/icons-material/Send";
import WebhookIcon from "@mui/icons-material/Webhook";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { GlassCard } from "../components/glass-card";
import { PRIMARY_BTN } from "../components/dashboard-ui";
import { requireDashboardSession } from "@/lib/dashboard-session";

const ACCENT = "#9b7bf7";
const TEXT = "#f5f5f4";
const TEXT_55 = "rgba(245,245,244,0.55)";
const BORDER = "rgba(255,255,255,0.07)";

interface Stat {
    label: string;
    value: string;
    icon: SvgIconComponent;
    accent: string;
}

const STATS: Stat[] = [
    { label: "Products", value: "—", icon: InventoryIcon, accent: "#9b7bf7" },
    { label: "Templates", value: "—", icon: DescriptionIcon, accent: "#86efac" },
    { label: "Sends this month", value: "—", icon: SendIcon, accent: "#5fb6ff" },
    { label: "Deliverability", value: "—", icon: InsightsIcon, accent: "#fbbf24" },
];

interface Step {
    icon: SvgIconComponent;
    title: string;
    body: string;
    cta: string;
    href: string;
    accent: string;
}

const STEPS: Step[] = [
    {
        icon: DnsIcon,
        title: "Connect a sender",
        body: "Add the mailbox you'll send from — email + app password, encrypted at rest.",
        cta: "Add sender",
        href: "/dashboard/senders",
        accent: "#9b7bf7",
    },
    {
        icon: InventoryIcon,
        title: "Create a product",
        body: "Group your templates under a product with its own client ID and shared secret.",
        cta: "New product",
        href: "/dashboard/products",
        accent: "#86efac",
    },
    {
        icon: DescriptionIcon,
        title: "Design a template",
        body: "Compose in the visual editor with {{variables}} and a live preview.",
        cta: "Create template",
        href: "/dashboard/templates",
        accent: "#5fb6ff",
    },
    {
        icon: WebhookIcon,
        title: "Add a webhook & send",
        body: "Wire a named, HMAC-signed webhook to a template and trigger your first send.",
        cta: "Add webhook",
        href: "/dashboard/webhooks",
        accent: "#fbbf24",
    },
];

export default async function OverviewPage() {
    const session = await requireDashboardSession();
    const name = session.name || session.email;

    return (
        <Box>
            {/* Greeting */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: { xs: 3.5, md: 4.5 } }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.7rem", md: "2.1rem" }, letterSpacing: "-0.02em", color: TEXT }}>
                        Welcome back, {name}
                    </Typography>
                    <Typography sx={{ color: TEXT_55, fontSize: "0.95rem", mt: 0.5 }}>
                        Your transactional email workspace. Connect a sender, create a product, and start sending.
                    </Typography>
                </Box>
                <Stack spacing={0.6} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                    <Typography sx={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(245,245,244,0.4)", fontWeight: 700 }}>
                        Tenant
                    </Typography>
                    <Chip
                        label={session.tenantId}
                        sx={{
                            fontFamily: "var(--font-geist-mono)",
                            fontSize: "0.76rem",
                            bgcolor: "rgba(155,123,247,0.12)",
                            color: "#c4b5fd",
                            border: "1px solid rgba(155,123,247,0.3)",
                        }}
                    />
                </Stack>
            </Stack>

            {/* Stat tiles */}
            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                    mb: { xs: 3, md: 4 },
                }}
            >
                {STATS.map((s) => (
                    <GlassCard key={s.label} sx={{ p: { xs: 2, md: 2.4 } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "11px",
                                    display: "grid",
                                    placeItems: "center",
                                    color: s.accent,
                                    background: `${s.accent}14`,
                                    border: `1px solid ${s.accent}33`,
                                }}
                            >
                                <s.icon sx={{ fontSize: 20 }} />
                            </Box>
                        </Stack>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.6rem", md: "1.9rem" }, color: TEXT, mt: 1.6, lineHeight: 1 }}>
                            {s.value}
                        </Typography>
                        <Typography sx={{ color: TEXT_55, fontSize: "0.82rem", mt: 0.6 }}>
                            {s.label}
                        </Typography>
                    </GlassCard>
                ))}
            </Box>

            {/* Main grid: quickstart + recent activity */}
            <Box
                sx={{
                    display: "grid",
                    gap: 2.5,
                    gridTemplateColumns: { xs: "1fr", lg: "1.55fr 1fr" },
                    alignItems: "start",
                }}
            >
                {/* Get started checklist */}
                <GlassCard>
                    <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: TEXT }}>
                            Get started
                        </Typography>
                        <Chip
                            label="4 steps"
                            size="small"
                            sx={{ height: 20, fontSize: "0.66rem", fontWeight: 700, color: "#c4b5fd", bgcolor: "rgba(155,123,247,0.12)", border: "1px solid rgba(155,123,247,0.3)" }}
                        />
                    </Stack>
                    <Typography sx={{ color: TEXT_55, fontSize: "0.9rem", mb: 2.5 }}>
                        Set up your workspace and trigger your first transactional send.
                    </Typography>

                    <Stack spacing={1.4}>
                        {STEPS.map((step, i) => (
                            <Box
                                key={step.title}
                                sx={{
                                    display: "flex",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    gap: 1.8,
                                    p: 1.8,
                                    borderRadius: "12px",
                                    border: `1px solid ${BORDER}`,
                                    background: "rgba(255,255,255,0.015)",
                                    flexDirection: { xs: "column", sm: "row" },
                                }}
                            >
                                <Box sx={{ position: "relative", flexShrink: 0 }}>
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "12px",
                                            display: "grid",
                                            placeItems: "center",
                                            color: step.accent,
                                            background: `${step.accent}14`,
                                            border: `1px solid ${step.accent}40`,
                                        }}
                                    >
                                        <step.icon sx={{ fontSize: 22 }} />
                                    </Box>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: -6,
                                            right: -6,
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            display: "grid",
                                            placeItems: "center",
                                            fontSize: "0.66rem",
                                            fontWeight: 800,
                                            color: "#0b0d12",
                                            background: step.accent,
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: "0.96rem", color: TEXT }}>
                                        {step.title}
                                    </Typography>
                                    <Typography sx={{ color: TEXT_55, fontSize: "0.85rem", lineHeight: 1.55 }}>
                                        {step.body}
                                    </Typography>
                                </Box>
                                <Button
                                    component={Link}
                                    href={step.href}
                                    endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem !important" }} />}
                                    sx={{
                                        flexShrink: 0,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "0.82rem",
                                        color: TEXT,
                                        px: 1.6,
                                        py: 0.7,
                                        borderRadius: "10px",
                                        border: `1px solid ${BORDER}`,
                                        whiteSpace: "nowrap",
                                        "&:hover": { borderColor: "rgba(155,123,247,0.5)", background: "rgba(155,123,247,0.06)" },
                                    }}
                                >
                                    {step.cta}
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                </GlassCard>

                {/* Recent activity empty state */}
                <GlassCard sx={{ height: "100%" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: TEXT }}>
                            Recent activity
                        </Typography>
                        <Button
                            component={Link}
                            href="/dashboard/logs"
                            sx={{ textTransform: "none", fontSize: "0.8rem", fontWeight: 600, color: ACCENT, minWidth: 0, p: 0.5, "&:hover": { background: "transparent", textDecoration: "underline" } }}
                        >
                            View all
                        </Button>
                    </Stack>
                    <Typography sx={{ color: TEXT_55, fontSize: "0.88rem", mb: 3 }}>
                        Delivery events appear here as you send.
                    </Typography>

                    <Stack alignItems="center" textAlign="center" spacing={1.6} sx={{ py: { xs: 4, md: 5 } }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "16px",
                                display: "grid",
                                placeItems: "center",
                                color: "rgba(245,245,244,0.4)",
                                background: "rgba(255,255,255,0.03)",
                                border: `1px solid ${BORDER}`,
                            }}
                        >
                            <HistoryIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: TEXT, mb: 0.5 }}>
                                No sends yet
                            </Typography>
                            <Typography sx={{ color: TEXT_55, fontSize: "0.86rem", lineHeight: 1.6, maxWidth: 280 }}>
                                Once you trigger a webhook, your first delivery will show up right here.
                            </Typography>
                        </Box>
                        <Button
                            component={Link}
                            href="/dashboard/senders"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: "1.05rem !important" }} />}
                            sx={{ ...PRIMARY_BTN, fontSize: "0.86rem", px: 2.2 }}
                        >
                            Get set up
                        </Button>
                    </Stack>
                </GlassCard>
            </Box>
        </Box>
    );
}
