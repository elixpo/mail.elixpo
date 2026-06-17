"use client";

// Browser-only. Imported exclusively through lix-editor.tsx via ssr:false, so
// BlockNote/Mantine never evaluate on the server (they touch browser globals at
// import time).
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "@elixpo/lixeditor/styles";
import {
    LixEditor,
    type LixEditorHandle,
    type LixEditorProps,
    LixThemeProvider,
} from "@elixpo/lixeditor";
import { useRef } from "react";

export interface LixEditorInnerProps {
    initialContent?: LixEditorProps["initialContent"];
    features?: LixEditorProps["features"];
    placeholder?: string;
    onChange?: (editor: any) => void;
    /** Receives the imperative handle (getHTML/getBlocks/…) once mounted. */
    onReady?: (api: LixEditorHandle) => void;
}

export default function LixEditorInner({
    initialContent,
    features,
    placeholder,
    onChange,
    onReady,
}: LixEditorInnerProps) {
    const ref = useRef<LixEditorHandle>(null);
    return (
        <LixThemeProvider theme="dark">
            <LixEditor
                ref={ref}
                initialContent={initialContent}
                features={features}
                placeholder={placeholder}
                onChange={onChange}
                onReady={() => {
                    if (ref.current) onReady?.(ref.current);
                }}
            />
        </LixThemeProvider>
    );
}
