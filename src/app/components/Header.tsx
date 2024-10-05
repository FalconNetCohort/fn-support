"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const tabs = ["Feature Request", "Support/Bug Report", "In Progress", "Login"];
    const adminTabs = ["Admin Dashboard", "User Guide Admin"];
    const pathname = usePathname();

    return (
        <header className="w-full p-4 text-white flex justify-between items-center shadow-xl" style={{ backgroundColor: '#000098' }}>
            <Link href="/" className="mx-2">
                <img src="/falconsupport.png" alt="Falcon Support" className="h-8 w-auto" />
            </Link>
            <nav className="text-gray-300">
                {tabs.map((tab) => (
                    <Link
                        href={tab === "Home" ? "/" : `/${tab.toLowerCase().replace(/[\s\/]/g, "-")}`}
                        key={tab}
                        className={`mx-2 font-bold hover:text-blue-400 ${pathname === (tab === "Home" ? "/" : `/${tab.toLowerCase().replace(/[\s\/]/g, "-")}`) && "text-white"}`}
                    >
                        {tab}
                    </Link>
                ))}
            </nav>
        </header>
    );
}