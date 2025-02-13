"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormatBold, FormatItalic, FormatUnderlined } from "@mui/icons-material";

interface RichTextEditorProps {
    content: string;
    setContent: (content: string) => void;
}

export default function RichTextEditor({ content, setContent }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <Paper sx={{ padding: 2, borderRadius: 2 }}>
            <Box display="flex" gap={1} marginBottom={2}>
                <ToggleButtonGroup size="small" aria-label="text formatting">
                    <ToggleButton
                        value="bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        selected={editor.isActive("bold")}
                        aria-label="bold"
                    >
                        <FormatBold />
                    </ToggleButton>
                    <ToggleButton
                        value="italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        selected={editor.isActive("italic")}
                        aria-label="italic"
                    >
                        <FormatItalic />
                    </ToggleButton>
                    <ToggleButton
                        value="underline"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        selected={editor.isActive("strike")}
                        aria-label="underline"
                    >
                        <FormatUnderlined />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <EditorContent editor={editor} />
        </Paper>
    );
}
