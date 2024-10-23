"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, arrayUnion } from "firebase/firestore";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthWrapper from "@/app/components/AuthWrapper";

// Define types for requests
interface Request {
    id: string;
    title?: string;
    description: string;
    priority?: string;
    status?: string;
    userName: string;
}

interface UpdateData {
    priority?: string;
    status?: string;
    comments?: any;
}

interface CommentData {
    [key: string]: string;
}

export default function Dashboard() {
    const [featureRequests, setFeatureRequests] = useState<Request[]>([]);
    const [supportRequests, setSupportRequests] = useState<Request[]>([]);
    const [comments, setComments] = useState<CommentData>({});
    const [updates, setUpdates] = useState<{ [key: string]: UpdateData }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
            if (!user) {
                router.push("/auth");
            } else {
                fetchRequests().then(r => r);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchRequests = async () => {
        const featureSnapshot = await getDocs(collection(db, "featureRequests"));
        const supportSnapshot = await getDocs(collection(db, "supportRequests"));

        setFeatureRequests(featureSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Request)));
        setSupportRequests(supportSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Request)));
    };

    const handleUpdate = async (id: string, type: "feature" | "support") => {
        const requestRef = doc(db, type === "feature" ? "featureRequests" : "supportRequests", id);

        const updateData: UpdateData = updates[id] || {};

        // Ensure updateData is non-empty before updating
        if (comments[id]) {
            // Cast the update object to the expected Firestore format
            await updateDoc(requestRef, {
                ...updateData,
                comments: arrayUnion({ text: comments[id], timestamp: new Date() }),
            } as Partial<UpdateData>); // Ensure Firestore accepts it as a partial update
        } else {
            // If no comments to add, update only the existing data
            await updateDoc(requestRef, updateData as Partial<UpdateData>);
        }

        alert("Request updated successfully");
        setComments({ ...comments, [id]: "" });
        setUpdates({});
        await fetchRequests();
    };


    const handleDelete = async (id: string, type: "feature" | "support") => {
        const requestRef = doc(db, type === "feature" ? "featureRequests" : "supportRequests", id);
        await deleteDoc(requestRef);
        alert("Request deleted successfully");
        await fetchRequests();
    };

    const handleChange = (id: string, field: keyof UpdateData, value: string) => {
        setUpdates({ ...updates, [id]: { ...updates[id], [field]: value } });
    };

    const handleCommentChange = (id: string, value: string) => {
        setComments({ ...comments, [id]: value });
    };

    const filteredFeatureRequests = featureRequests.filter((request) =>
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSupportRequests = supportRequests.filter((request) =>
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderRequests = (requests: Request[], type: "feature" | "support") =>
        requests.length === 0 ? (
            <div className="text-gray-400">No posts yet</div>
        ) : (
            requests.map((request) => (
                <div key={request.id} className="p-4 mb-4 border rounded-lg shadow bg-gray-800">
                    <h3 className="text-xl font-semibold">{request.title}</h3>
                    <p className="text-gray-300 mb-2">{request.description}</p>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={updates[request.id]?.priority || request.priority || "Low"}
                            onChange={(e) => handleChange(request.id, "priority", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            value={updates[request.id]?.status || request.status || "in-progress"}
                            onChange={(e) => handleChange(request.id, "status", e.target.value)}
                            className={`px-2 py-1 rounded-lg text-sm ${updates[request.id]?.status === "complete" || request.status === "complete"
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                        >
                            <option value="in-progress">In Progress</option>
                            <option value="complete">Complete</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            id="comment"
                            value={comments[request.id] || ""}
                            onChange={(e) => handleCommentChange(request.id, e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <button
                        onClick={() => handleUpdate(request.id, type)}
                        className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                        Update/Post Comment
                    </button>
                    <button
                        onClick={() => handleDelete(request.id, type)}
                        className="mt-2 ml-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                    >
                        Delete
                    </button>
                    <div className="text-gray-400 text-sm mt-2">Submitted by: {request.userName}</div>
                </div>
            ))
        );

    return (
        <AuthWrapper>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
                <h1 className="text-3xl mb-6">Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-black"
                />
                <div className="w-full max-w-5xl">
                    <h2 className="text-2xl mb-4">In Progress</h2>
                    <div className="flex justify-between">
                        <div className="w-1/2 pr-2">
                            <h3 className="text-xl mb-2">Feature Requests</h3>
                            {renderRequests(filteredFeatureRequests.filter((request) => request.status !== "complete"), "feature")}
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="text-xl mb-2">Support Requests</h3>
                            {renderRequests(filteredSupportRequests.filter((request) => request.status !== "complete"), "support")}
                        </div>
                    </div>
                    <h2 className="text-2xl mt-6 mb-4">Complete</h2>
                    <div className="flex justify-between">
                        <div className="w-1/2 pr-2">
                            <h3 className="text-xl mb-2">Feature Requests</h3>
                            {renderRequests(filteredFeatureRequests.filter((request) => request.status === "complete"), "feature")}
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="text-xl mb-2">Support Requests</h3>
                            {renderRequests(filteredSupportRequests.filter((request) => request.status === "complete"), "support")}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </AuthWrapper>
    );
}
