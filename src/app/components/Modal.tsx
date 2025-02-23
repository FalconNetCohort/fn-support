import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content?: string; // Passed directly as HTML
}

export default function Modal({ isOpen, onClose, title, content }: ModalProps) {
    console.log("📌 Modal Opened with Content:", content);

    // Convert <attachment-card> placeholders to actual JSX components
    const parseAttachments = (htmlContent: string) => {
        if (!htmlContent) return "";

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        doc.querySelectorAll("attachment-card").forEach((node) => {
            const fileUrl = node.getAttribute("data-url");
            if (fileUrl) {
                // Extract only the filename, removing directory structure
                const fileName = decodeURIComponent(fileUrl.split("/").pop()?.split("?")[0] || "Unknown File")
                    .replace(/^guideAttachments\/[0-9]+-/, ""); // Remove "guideAttachments/ and timestamp"

                // Create a new div element to replace <attachment-card>
                const attachmentDiv = document.createElement("div");
                attachmentDiv.className = "flex items-center gap-2 bg-gray-800 p-3 rounded-lg overflow-hidden";

                attachmentDiv.innerHTML = `
                <span style="font-size:1.5rem; flex-shrink:0;">📎</span>
                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer"
                    style="color:white; font-weight:bold; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;">
                    ${fileName}
                </a>
            `;

                node.replaceWith(attachmentDiv);
            }
        });

        return doc.body.innerHTML;
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-900 text-white rounded-2xl w-[90%] md:w-[60%] lg:w-[50%] max-h-[80vh] p-6 shadow-xl overflow-y-auto"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                        <div className="prose prose-invert max-w-none">
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: parseAttachments(content) }} />
                            ) : (
                                <p className="text-gray-300">Loading content...</p>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
