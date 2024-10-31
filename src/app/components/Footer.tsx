"use client";
import { LinkPreview } from "../components/ui/link-preview";

export default function Footer() {
    return (
        <footer className="w-full p-4 bg-gray-800 text-white flex flex-col items-center">
            <h2 className="text-lg font-bold">Helpful Links</h2>
            <div className="flex flex-row items-start justify-between space-x-4 mt-2">
                <LinkPreview url="https://falconnet.us" className="text-blue-800 underline">
                    FalconNet
                </LinkPreview>
                <LinkPreview url="https://apps.apple.com/us/app/falconnet/id6445867869" className="text-blue-800 underline">
                    App Store
                </LinkPreview>
                <LinkPreview
                    url="https://play.google.com/store/apps/details?id=com.arkwerk.falconnet&pcampaignid=web_share"
                    className="text-blue-800 underline">
                    Google Play
                </LinkPreview>
                <LinkPreview url="https://github.com/FalconNetCohort" className="text-blue-800 underline">
                    GitHub
                </LinkPreview>
            </div>
            <div className="my-2">
                <p>&copy; {new Date().getFullYear()} FalconSupport. All rights reserved.</p>
            </div>
        </footer>
    );
}
