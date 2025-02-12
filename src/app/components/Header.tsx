"use client";
import Link from "next/link";
import NavMenu from "@/app/components/NavMenu";

export default function Header() {
    return (
        <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold"><Link href="/" className="mx-2">FalconSupport</Link></h1>
            <nav>
                <NavMenu/>
            </nav>
        </header>
    );
}
