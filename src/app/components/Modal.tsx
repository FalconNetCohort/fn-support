"use client";
import { useEffect } from "react";
import 'tailwindcss/tailwind.css';  // Ensure Tailwind CSS is imported

export default function Modal({ isOpen, onClose, title, content }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg w-3/4 max-w-lg p-6 overflow-y-auto max-h-full">
                <h2 className="text-2xl mb-4">{title}</h2>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }}></div>
                <button
                    onClick={onClose}
                    className="mt-4 p-2 bg-blue-600 text-white rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
