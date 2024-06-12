"use client";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">FalconSupport</h1>
            <nav>
                <Link href="/" className="mx-2">Home</Link>
                <Link href="/feature-request" className="mx-2">Feature Request</Link>
                <Link href="/support-bug-report" className="mx-2">Support/Bug Report</Link>
                <Link href="/in-progress" className="mx-2">In Progress</Link>
            </nav>
        </header>
    );
}
