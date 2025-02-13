import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatQuote, Image as ImageIcon, Title, AttachFile } from "@mui/icons-material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Attachment } from "@/app/extensions/Attachment";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";

interface RichTextEditorProps {
    content: string;
    setContent: (content: string) => void;
}

export default function RichTextEditor({ content, setContent }: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false);
    const [activeFormats, setActiveFormats] = useState<string[]>([]);
    const storage = getStorage();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Attachment,
            Underline,
            Image,
            BulletList,
            ListItem,
            Heading.configure({ levels: [1, 2, 3] }),
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            setActiveFormats([
                editor.isActive("bold") ? "bold" : "",
                editor.isActive("italic") ? "italic" : "",
                editor.isActive("underline") ? "underline" : "",
                editor.isActive("bulletList") ? "bullet-list" : "",
                editor.isActive("blockquote") ? "blockquote" : "",
                editor.isActive("heading", { level: 1 }) ? "h1" : "",
                editor.isActive("heading", { level: 2 }) ? "h2" : "",
                editor.isActive("heading", { level: 3 }) ? "h3" : "",
            ].filter(Boolean));
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none w-full min-h-[200px] p-4 outline-none", // ✅ Ensure dark text
            },
        },
    });

    if (!editor) return null;

    // ✅ Handle Image Upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const storageRef = ref(storage, `guideAttachments/${Date.now()}-${file.name}`);

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

    // ✅ Handle Attachment Upload
    const handleAttachmentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const storageRef = ref(storage, `guideAttachments/${Date.now()}-${file.name}`);

        setUploading(true);
        try {
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);

            editor.chain().focus().insertContent({
                type: "attachment",
                attrs: { fileUrl },
            }).run();
        } catch (error) {
            console.error("❌ Error uploading attachment:", error);
        }
        setUploading(false);
    };

    return (
        <Paper sx={{ padding: 2, borderRadius: 2, backgroundColor: "rgba(240, 240, 240, 0.8)" }}>
            {/* Formatting Buttons */}
            <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
                <ToggleButtonGroup size="small" aria-label="text formatting">
                    <ToggleButton
                        value="bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        selected={activeFormats.includes("bold")}
                        aria-label="bold"
                    >
                        <FormatBold />
                    </ToggleButton>
                    <ToggleButton
                        value="italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        selected={activeFormats.includes("italic")}
                        aria-label="italic"
                    >
                        <FormatItalic />
                    </ToggleButton>
                    <ToggleButton
                        value="underline"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        selected={activeFormats.includes("underline")}
                        aria-label="underline"
                    >
                        <FormatUnderlined />
                    </ToggleButton>
                    <ToggleButton
                        value="bullet-list"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        selected={activeFormats.includes("bullet-list")}
                        aria-label="bullet-list"
                    >
                        <FormatListBulleted />
                    </ToggleButton>
                    <ToggleButton
                        value="blockquote"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        selected={activeFormats.includes("blockquote")}
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
                        selected={activeFormats.includes("h1")}
                        aria-label="Heading 1"
                    >
                        <Title fontSize="small" />
                        H1
                    </ToggleButton>
                    <ToggleButton
                        value="h2"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        selected={activeFormats.includes("h2")}
                        aria-label="Heading 2"
                    >
                        <Title fontSize="small" />
                        H2
                    </ToggleButton>
                    <ToggleButton
                        value="h3"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        selected={activeFormats.includes("h3")}
                        aria-label="Heading 3"
                    >
                        <Title fontSize="small" />
                        H3
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Image & Attachment Upload Buttons */}
            <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                <Button component="label" variant="contained" startIcon={<ImageIcon />}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </Button>
                <Button component="label" variant="contained" startIcon={<AttachFile />}>
                    Upload Attachment
                    <input type="file" hidden onChange={handleAttachmentUpload} />
                </Button>
                {uploading && <p>Uploading...</p>}
            </Box>

            {/* Text Editor */}
            <Paper
                sx={{
                    borderRadius: 2,
                    padding: 2,
                    minHeight: "7em",
                    maxHeight: "32em",
                    overflowY: "auto",
                    cursor: "text",
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)", // ✅ Fixed background issue
                }}
                onClick={() => editor?.commands.focus()}
            >
                <EditorContent editor={editor} />
            </Paper>
        </Paper>
    );
}
