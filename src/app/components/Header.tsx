"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">FalconSupport</h1>
            <nav>
                <Link href="/" className="mx-2">Home</Link>
                <Link href="/about" className="mx-2">About</Link>
                <Link href="/contact" className="mx-2">Contact</Link>
            </nav>
        </header>
    );
}