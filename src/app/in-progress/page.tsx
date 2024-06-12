"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function InProgress() {
    // Dummy data for tickets
    const tickets = [
        {
            id: 1,
            title: "Feature: Add Dark Mode",
            description: "Implement a dark mode for the application.",
            priority: "High",
            submittedBy: "John Doe",
            status: "In Progress",
        },
        {
            id: 2,
            title: "Bug: Fix Login Issue",
            description: "Resolve the bug preventing users from logging in.",
            priority: "Critical",
            submittedBy: "Jane Smith",
            status: "In Progress",
        },
        {
            id: 3,
            title: "Feature: Add Multi-language Support",
            description: "Support multiple languages in the application.",
            priority: "Medium",
            submittedBy: "Alice Johnson",
            status: "In Progress",
        },
        // Add more dummy tickets as needed
    ];

    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center p-6">
                <h1 className="text-3xl mb-6">In Progress</h1>
                <div className="w-full max-w-5xl">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 mb-4 border rounded-lg shadow">
                            <h2 className="text-xl font-semibold">{ticket.title}</h2>
                            <p className="text-gray-700 mb-2">{ticket.description}</p>
                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-lg text-sm ${ticket.priority === "Critical" ? "bg-red-500 text-white" : ticket.priority === "High" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>
                                    {ticket.priority}
                                </span>
                                <span className="text-gray-500 text-sm">Submitted by: {ticket.submittedBy}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
