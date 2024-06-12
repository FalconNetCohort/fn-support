"use client";
import { useEffect } from "react";

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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-3/4 max-w-lg p-6">
                <h2 className="text-2xl mb-4">{title}</h2>
                <p>{content}</p>
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
