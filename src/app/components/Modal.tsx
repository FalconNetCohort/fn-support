"use client";
import { useEffect } from "react";
import ReactMarkdown from 'react-markdown';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export default function Modal({ isOpen, onClose, title, content }: ModalProps) {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50" style={{ paddingTop: '5%', paddingBottom: '5%' }}>
            <div className="bg-gray-900 text-white rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-full">
                <h2 className="text-2xl mb-4">{title}</h2>
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
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
