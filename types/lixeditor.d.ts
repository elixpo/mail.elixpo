// @elixpo/lixeditor ships no TypeScript types (v2.6.9). Minimal ambient
// declarations so we can consume it type-checked. DOGFOODING TODO: upstream
// proper .d.ts to the package.
declare module "@elixpo/lixeditor" {
    import type { ComponentType, ReactNode, Ref } from "react";

    /** A BlockNote document block (opaque to us — we store/round-trip it). */
    export type LixBlock = Record<string, any>;

    /** Imperative handle exposed via LixEditor's ref. */
    export interface LixEditorHandle {
        getDocument(): LixBlock[];
        getEditor(): any;
        getBlocks(): LixBlock[];
        getHTML(): Promise<string>;
        getMarkdown(): Promise<string>;
    }

    export interface LixFeatures {
        equations?: boolean;
        mermaid?: boolean;
        codeHighlighting?: boolean;
        tableOfContents?: boolean;
        images?: boolean;
        buttons?: boolean;
        pdf?: boolean;
        dates?: boolean;
        linkPreview?: boolean;
        markdownLinks?: boolean;
    }

    export interface LixEditorProps {
        initialContent?: LixBlock[] | string | null;
        /** Called on every change with the underlying BlockNote editor instance. */
        onChange?: (editor: any) => void;
        onReady?: () => void;
        features?: LixFeatures;
        placeholder?: string;
        codeLanguages?: Record<string, any>;
        extraBlockSpecs?: any[];
        extraInlineSpecs?: any[];
        slashMenuItems?: any[];
        collaboration?: any;
        children?: ReactNode;
        ref?: Ref<LixEditorHandle>;
    }

    export const LixEditor: ComponentType<LixEditorProps>;

    export interface LixPreviewProps {
        blocks?: LixBlock[] | null;
        html?: string;
        features?: LixFeatures;
    }
    export const LixPreview: ComponentType<LixPreviewProps>;

    export interface LixThemeProviderProps {
        children: ReactNode;
        theme?: "light" | "dark";
        defaultTheme?: "light" | "dark";
        storageKey?: string | null;
        onThemeChange?: (t: "light" | "dark") => void;
    }
    export const LixThemeProvider: ComponentType<LixThemeProviderProps>;
    export function useLixTheme(): {
        theme: "light" | "dark";
        isDark: boolean;
        setTheme: (t: "light" | "dark") => void;
        toggleTheme: () => void;
        mounted: boolean;
    };

    export function renderBlocksToHTML(blocks: LixBlock[] | null | undefined): string;

    // Block specs (for custom schemas) — opaque.
    export const BlockEquation: any;
    export const InlineEquation: any;
    export const DateInline: any;
    export const MermaidBlock: any;
    export const TableOfContents: any;
    export const ButtonBlock: any;
    export const PDFEmbedBlock: any;
    export const ImageBlock: any;
    export const LinkPreviewTooltip: any;
    export const KeyboardShortcutsModal: any;
    export function useLinkPreview(): any;
    export function setLinkPreviewEndpoint(url: string): void;
}

declare module "@elixpo/lixeditor/styles";
declare module "@blocknote/core/fonts/inter.css";
declare module "@blocknote/mantine/style.css";
