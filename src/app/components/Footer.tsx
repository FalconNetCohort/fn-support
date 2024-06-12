"use client";
import { LinkPreview } from "../components/ui/link-preview";

export default function Footer() {
    return (
        <footer className="w-full p-4 bg-gray-800 text-white flex flex-col items-center">
            <div className="flex flex-col items-start">
                <h2 className="text-lg font-bold">Helpful Links</h2>
                <LinkPreview url="https://github.com/FalconNetCohort" className="mt-2">
                    GitHub Organization
                </LinkPreview>
                <LinkPreview url="https://falconnet.us" className="mt-2">
                    FalconNet
                </LinkPreview>
                <LinkPreview url="https://apps.apple.com/us/app/falconnet/id6445867869" className="mt-2">
                    Apple App Store
                </LinkPreview>
                <LinkPreview url="https://play.google.com/store/apps/details?id=com.arkwerk.falconnet&pcampaignid=web_share" className="mt-2">
                    Google Play Store
                </LinkPreview>
            </div>
            <div className="mt-4">
                <p>&copy; {new Date().getFullYear()} FalconSupport. All rights reserved.</p>
            </div>
        </footer>
    );
}
