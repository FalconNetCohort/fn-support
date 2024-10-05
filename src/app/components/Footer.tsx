"use client";
import { useTheme } from "next-themes";
import { LinkPreview } from "../components/ui/link-preview";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function Footer() {
    const {theme, setTheme} = useTheme();
    return (
        <footer className="w-full p-4 bg-gray-800 text-white flex items-center pt-5">
            <div className="flex-1">
                <p>&copy; {new Date().getFullYear()} FalconSupport. All rights reserved.</p>
            </div>
            <div className="flex space-x-3">
                <LinkPreview url="https://github.com/FalconNetCohort" className="text-gray-300">
                    GitHub Organization
                </LinkPreview>
                <LinkPreview url="https://falconnet.us" className="text-gray-300">
                    FalconNet
                </LinkPreview>
                <LinkPreview url="https://apps.apple.com/us/app/falconnet/id6445867869" className="text-gray-300">
                    Apple App Store
                </LinkPreview>
                <LinkPreview url="https://play.google.com/store/apps/details?id=com.arkwerk.falconnet&pcampaignid=web_share" className="text-gray-300">
                    Google Play Store
                </LinkPreview>
            </div>
            {theme === "light" ? (
                <button onClick={() => setTheme("dark")}>
                    <MoonIcon className="w-5 h-5 ml-5"/>
                </button>
            ) : (
                <button onClick={() => setTheme("light")}>
                    <SunIcon className="w-5 h-5 ml-5"/>
                </button>
            )}

        </footer>
    );
}
