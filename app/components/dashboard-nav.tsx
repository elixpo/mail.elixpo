"use client";

import type { SvgIconComponent } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCENT = "#9b7bf7";
const BORDER = "rgba(255,255,255,0.07)";

export interface NavItem {
    label: string;
    href: string;
    icon: SvgIconComponent;
}

interface Props {
    primary: NavItem[];
    secondary: NavItem[];
    mobileOpen: boolean;
    onClose: () => void;
}

function isActive(pathname: string, href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
    const Icon = item.icon;
    return (
        <Box
            component={Link}
            href={item.href}
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.3,
                px: 1.5,
                py: 1.05,
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: active ? 700 : 500,
                color: active ? "#f5f5f4" : "rgba(245,245,244,0.62)",
                background: active ? "rgba(155,123,247,0.12)" : "transparent",
                border: `1px solid ${active ? "rgba(155,123,247,0.28)" : "transparent"}`,
                position: "relative",
                transition: "all 0.15s ease",
                "&:hover": {
                    color: "#f5f5f4",
                    background: active ? "rgba(155,123,247,0.14)" : "rgba(255,255,255,0.04)",
                },
            }}
        >
            <Icon sx={{ fontSize: 20, color: active ? ACCENT : "rgba(245,245,244,0.55)" }} />
            {item.label}
        </Box>
    );
}

function Brand() {
    return (
        <Box
            component={Link}
            href="/dashboard"
            sx={{ display: "flex", alignItems: "center", gap: 1.2, textDecoration: "none", color: "inherit", px: 0.5 }}
        >
            <Box
                component="img"
                src="/mark.png"
                alt="mail.elixpo"
                sx={{ height: 30, width: 30, borderRadius: "8px", display: "block" }}
            />
            <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#f5f5f4", letterSpacing: "-0.01em" }}>
                mail
                <Box component="span" sx={{ color: ACCENT }}>
                    .elixpo
                </Box>
            </Typography>
        </Box>
    );
}

function NavBody({ primary, secondary, pathname, onClick }: {
    primary: NavItem[];
    secondary: NavItem[];
    pathname: string;
    onClick?: () => void;
}) {
    return (
        <Stack sx={{ flex: 1, minHeight: 0 }}>
            <Stack spacing={0.4} sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                <Typography
                    sx={{
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(245,245,244,0.35)",
                        px: 1.5,
                        mb: 0.6,
                    }}
                >
                    Workspace
                </Typography>
                {primary.map((item) => (
                    <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} onClick={onClick} />
                ))}
            </Stack>
            <Box sx={{ borderTop: `1px solid ${BORDER}`, mt: 1.5, pt: 1.5 }}>
                <Stack spacing={0.4}>
                    {secondary.map((item) => (
                        <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} onClick={onClick} />
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}

export default function DashboardNav({ primary, secondary, mobileOpen, onClose }: Props) {
    const pathname = usePathname() || "/dashboard";

    return (
        <>
            {/* Desktop sidebar */}
            <Box
                component="aside"
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: 256,
                    zIndex: 1100,
                    px: 1.5,
                    py: 2,
                    borderRight: `1px solid ${BORDER}`,
                    background: "rgba(13,16,22,0.82)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <Box sx={{ px: 0.5, mb: 2.5 }}>
                    <Brand />
                </Box>
                <NavBody primary={primary} secondary={secondary} pathname={pathname} />
            </Box>

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{ display: { xs: "block", md: "none" } }}
                PaperProps={{
                    sx: {
                        width: 264,
                        px: 1.5,
                        py: 2,
                        background: "#0d1016",
                        borderRight: `1px solid ${BORDER}`,
                        color: "#f5f5f4",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5, px: 0.5 }}>
                    <Brand />
                    <IconButton onClick={onClose} sx={{ color: "rgba(245,245,244,0.6)" }} aria-label="Close menu">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <NavBody primary={primary} secondary={secondary} pathname={pathname} onClick={onClose} />
            </Drawer>
        </>
    );
}
