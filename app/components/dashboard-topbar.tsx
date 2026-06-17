"use client";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import DnsIcon from "@mui/icons-material/Dns";
import HistoryIcon from "@mui/icons-material/History";
import InventoryIcon from "@mui/icons-material/Inventory2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WebhookIcon from "@mui/icons-material/Webhook";
import {
    Avatar,
    Box,
    Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import DashboardNav, { type NavItem } from "./dashboard-nav";

const BORDER = "rgba(255,255,255,0.07)";

const PRIMARY_NAV: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: DashboardIcon },
    { label: "Products", href: "/dashboard/products", icon: InventoryIcon },
    { label: "Templates", href: "/dashboard/templates", icon: DescriptionIcon },
    { label: "Senders", href: "/dashboard/senders", icon: DnsIcon },
    { label: "Webhooks", href: "/dashboard/webhooks", icon: WebhookIcon },
    { label: "Delivery logs", href: "/dashboard/logs", icon: HistoryIcon },
    { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

const SECONDARY_NAV: NavItem[] = [
    { label: "Billing & Plan", href: "/dashboard/billing", icon: ReceiptLongIcon },
];

export interface DashboardUser {
    name: string;
    email: string;
    avatar: string | null;
    tenantId: string;
}

function initials(user: DashboardUser): string {
    return (user.name || user.email || "?").charAt(0).toUpperCase();
}

export default function DashboardTopbar({ user }: { user: DashboardUser }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    return (
        <>
            <DashboardNav
                primary={PRIMARY_NAV}
                secondary={SECONDARY_NAV}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <Box
                component="header"
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1050,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 2, md: 3 },
                    borderBottom: `1px solid ${BORDER}`,
                    background: "rgba(11,13,18,0.72)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <IconButton
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    sx={{ display: { xs: "inline-flex", md: "none" }, color: "rgba(245,245,244,0.8)", mr: 0.5 }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                {/* User menu */}
                <Box
                    component="button"
                    onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        background: "transparent",
                        border: `1px solid ${menuOpen ? "rgba(155,123,247,0.4)" : BORDER}`,
                        borderRadius: "10px",
                        pl: 0.6,
                        pr: { xs: 0.6, sm: 1 },
                        py: 0.5,
                        color: "inherit",
                        font: "inherit",
                        transition: "all 0.15s ease",
                        "&:hover": { borderColor: "rgba(155,123,247,0.4)", background: "rgba(155,123,247,0.06)" },
                    }}
                >
                    <Avatar
                        src={user.avatar || undefined}
                        sx={{ width: 28, height: 28, fontSize: "0.85rem", bgcolor: "rgba(155,123,247,0.4)" }}
                    >
                        {initials(user)}
                    </Avatar>
                    <Stack sx={{ display: { xs: "none", sm: "flex" }, alignItems: "flex-start", lineHeight: 1.1 }}>
                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#f5f5f4", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.name || user.email}
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(245,245,244,0.45)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.email}
                        </Typography>
                    </Stack>
                    <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "rgba(245,245,244,0.5)", display: { xs: "none", sm: "block" } }} />
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 1,
                                minWidth: 248,
                                background: "#13161d",
                                border: `1px solid ${BORDER}`,
                                borderRadius: "12px",
                                color: "#f5f5f4",
                                boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                            },
                        },
                    }}
                >
                    <Box sx={{ px: 2, py: 1.4 }}>
                        <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#f5f5f4" }}>
                            {user.name || user.email}
                        </Typography>
                        <Typography sx={{ fontSize: "0.78rem", color: "rgba(245,245,244,0.5)" }}>
                            {user.email}
                        </Typography>
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 0.9 }}>
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(245,245,244,0.35)" }}>
                                Tenant
                            </Typography>
                            <Typography sx={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.7rem", color: "#c4b5fd", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user.tenantId}
                            </Typography>
                        </Stack>
                    </Box>
                    <Divider sx={{ borderColor: BORDER }} />
                    <MenuItem
                        component={Link}
                        href="/dashboard/settings"
                        onClick={() => setAnchorEl(null)}
                        sx={{ fontSize: "0.86rem", py: 1.1, gap: 1.2, "&:hover": { background: "rgba(255,255,255,0.04)" } }}
                    >
                        <SettingsIcon sx={{ fontSize: 18, color: "rgba(245,245,244,0.55)" }} />
                        Settings
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href="/"
                        onClick={() => setAnchorEl(null)}
                        sx={{ fontSize: "0.86rem", py: 1.1, gap: 1.2, "&:hover": { background: "rgba(255,255,255,0.04)" } }}
                    >
                        <OpenInNewIcon sx={{ fontSize: 18, color: "rgba(245,245,244,0.55)" }} />
                        View marketing site
                    </MenuItem>
                    <Divider sx={{ borderColor: BORDER }} />
                    <MenuItem
                        component="a"
                        href="/api/auth/logout"
                        sx={{
                            fontSize: "0.86rem",
                            py: 1.1,
                            gap: 1.2,
                            color: "#fca5a5",
                            "&:hover": { background: "rgba(239,68,68,0.08)", color: "#fecaca" },
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        Sign out
                    </MenuItem>
                </Menu>
            </Box>
        </>
    );
}
