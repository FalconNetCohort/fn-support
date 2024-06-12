"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4 bg-gray-800 text-white flex flex-col items-center">
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-bold">Helpful Links</h2>
        <Link href="https://github.com/FalconNetCohort" className="mt-2">GitHub Organization</Link>
        <Link href="https://falconnet.us" className="mt-2">FalconNet</Link>
        <Link href="https://apps.apple.com/us/app/falconnet/id6445867869" className="mt-2">Apple App Store</Link>
        <Link href="https://play.google.com/store/apps/details?id=com.arkwerk.falconnet&pcampaignid=web_share" className="mt-2">Google Play Store</Link>
      </div>
      <div className="mt-4">
        <p>&copy; {new Date().getFullYear()} FalconSupport. All rights reserved.</p>
      </div>
    </footer>
  );
}
