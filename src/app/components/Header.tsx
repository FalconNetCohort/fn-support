"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const tabs = ["Home", "Feature Request", "Support/Bug Report", "In Progress"];
    const adminTabs = ["Admin Dashboard", "User Guide Admin"]
    const pathname = usePathname()

    return (
        <header className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">
                <Link href="/" className="mx-2">Falcon Support</Link></h1>
            <nav className="text-gray-300">     
                {tabs.map((tab) => (
                    <Link 
                    href={tab==="Home"?"/":`/${tab.toLowerCase().replace(/[\s\/]/g, "-")}`} 
                    key={tab} 
                    className={`mx-2 ${pathname === (tab==="Home"?"/":`/${tab.toLowerCase().replace(/[\s\/]/g, "-")}`) && "text-white"}`}>
                        {tab}
                    </Link>
                ))}
            </nav>
        </header>
    );
}
