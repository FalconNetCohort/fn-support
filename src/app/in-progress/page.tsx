"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "../firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";

type Priority = "Low" | "Medium" | "High" | "Critical" | undefined
type SortField = "priority" | "status" | "name"

interface Ticket {
    id: string; 
    type: string;
    featureDescription?: string;
    bugDescription?: string;
    supplementalInfo?: string;
    priority?: Priority;
    comments?: {
        text: string;
        timestamp: Timestamp
    }[];
    status?: string;
    name?: string
}

export default function InProgress() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("priority");

    useEffect(() => {
        const fetchTickets = async () => {
            const featureSnapshot = await getDocs(collection(db, "featureRequests"));
            const supportSnapshot = await getDocs(collection(db, "supportRequests"));
            const allTickets = [
                ...featureSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, type: "Feature" })),
                ...supportSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, type: "Support" })),
            ];
            setTickets(allTickets);
        };

        fetchTickets();
    }, []);

    const filteredTickets = tickets
        .filter(ticket =>
            ticket.featureDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.bugDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.supplementalInfo?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortField === "priority") {
                const priorityOrder: Priority[] = ["Low", "Medium", "High", "Critical"];
                return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
            }
            
            const aValue = a[sortField] ?? String.fromCharCode(255)
            const bValue = b[sortField] ?? String.fromCharCode(255)

            return aValue.localeCompare(bValue)
        });

    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
                <h1 className="text-3xl mb-6">In Progress</h1>
                <div className="w-full max-w-5xl">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-black"
                    />
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="sortField">
                            Sort By
                        </label>
                        <select
                            id="sortField"
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value as SortField)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="priority">Priority</option>
                            <option value="status">Status</option>
                            <option value="name">Submitted By</option>
                        </select>
                    </div>
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 mb-4 border rounded-lg shadow bg-gray-800">
                            <h2 className="text-xl font-semibold">{ticket.type}: {ticket.featureDescription || ticket.bugDescription}</h2>
                            <p className="text-gray-300 mb-2">{ticket.supplementalInfo}</p>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`px-2 py-1 rounded-lg text-sm ${ticket.priority === "Critical" ? "bg-red-500 text-white" : ticket.priority === "High" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}>
                                    {ticket.priority || "N/A"}
                                </span>
                                <span className={`px-2 py-1 rounded-lg text-sm ${ticket.status === "complete" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                                    {ticket.status || "in-progress"}
                                </span>
                                <span className="text-gray-400 text-sm">Submitted by: {ticket.name}</span>
                            </div>
                            {ticket.comments && ticket.comments.map((comment, index) => (
                                <div key={index} className="mt-4 p-2 border-t border-gray-600">
                                    <p className="text-gray-300"><strong>Comment from FalconNet Team:</strong> {comment.text} <span className="text-xs text-gray-500">({new Date(comment.timestamp?.seconds * 1000).toLocaleString()})</span></p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
