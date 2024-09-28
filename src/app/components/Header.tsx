"use client";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold"><Link href="/" className="mx-2">Falcon Support</Link></h1>
            <nav>
                <Link href="/in-progress" className="mx-2">In Progress</Link>
                <Link href="/feature-request" className="mx-2">Feature Request</Link>
                <Link href="/support-bug-report" className="mx-2">Support/Bug Report</Link>
                <Link href="/dashboard" className="mx-2">Admin Dashboard</Link>
                <Link href="/user-guides" className="mx-2">User Guide Admin</Link>
            </nav>
        </header>
    );
}
