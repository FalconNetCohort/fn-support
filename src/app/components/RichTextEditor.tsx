"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Box, Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatQuote, CloudUpload, Image as ImageIcon, Title } from "@mui/icons-material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface RichTextEditorProps {
    content: string;
    setContent: (content: string) => void;
}

export default function RichTextEditor({ content, setContent }: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false);
    const storage = getStorage();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3] }),
            Image,
            Underline,
            BulletList,
            ListItem
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    if (!editor) return null;

    // Handle image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];

        // Ensure the file is stored in the correct directory
        const storageRef = ref(storage, `guideAttachments/${file.name}`);

        setUploading(true);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);

            editor.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error) {
            console.error("❌ Error uploading image:", error);
        }
        setUploading(false);
    };


    // Handle attachment upload
    const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];

        // Ensure the file is stored in the correct directory
        const storageRef = ref(storage, `guideAttachments/${file.name}`);

        setUploading(true);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(snapshot.ref);

            editor.chain().focus().insertContent(`<a href="${fileUrl}" target="_blank">${file.name}</a>`).run();
        } catch (error) {
            console.error("❌ Error uploading attachment:", error);
        }
        setUploading(false);
    };


    return (
        <Paper sx={{ padding: 2, borderRadius: 2 }}>
            {/* Formatting Buttons */}
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
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        selected={editor.isActive("underline")}
                        aria-label="underline"
                    >
                        <FormatUnderlined />
                    </ToggleButton>
                    <ToggleButton
                        value="bullet-list"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        selected={editor.isActive("bulletList")}
                        aria-label="bullet-list"
                    >
                        <FormatListBulleted />
                    </ToggleButton>
                    <ToggleButton
                        value="blockquote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        selected={editor.isActive("blockquote")}
                        aria-label="blockquote"
                    >
                        <FormatQuote />
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Heading Buttons */}
                <ToggleButtonGroup size="small" aria-label="heading formatting">
                    <ToggleButton
                        value="h1"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        selected={editor.isActive("heading", { level: 1 })}
                        aria-label="Heading 1"
                    >
                        <Title fontSize="small" />
                        H1
                    </ToggleButton>
                    <ToggleButton
                        value="h2"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        selected={editor.isActive("heading", { level: 2 })}
                        aria-label="Heading 2"
                    >
                        <Title fontSize="small" />
                        H2
                    </ToggleButton>
                    <ToggleButton
                        value="h3"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        selected={editor.isActive("heading", { level: 3 })}
                        aria-label="Heading 3"
                    >
                        <Title fontSize="small" />
                        H3
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Image & Attachment Upload Buttons */}
            <Box display="flex" gap={1} marginBottom={2}>
                <Button component="label" variant="contained" startIcon={<ImageIcon />}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
                <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                    Upload Attachment
                    <input type="file" hidden onChange={handleAttachmentUpload} />
                </Button>
                {uploading && <p>Uploading...</p>}
            </Box>

            {/* Text Editor Content */}
            <EditorContent editor={editor} />
        </Paper>
    );
}
