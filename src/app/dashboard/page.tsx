"use client";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
    const [featureRequests, setFeatureRequests] = useState([]);
    const [supportRequests, setSupportRequests] = useState([]);
    const [comments, setComments] = useState({});
    const [updates, setUpdates] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const featureSnapshot = await getDocs(collection(db, "featureRequests"));
        const supportSnapshot = await getDocs(collection(db, "supportRequests"));

        setFeatureRequests(featureSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setSupportRequests(supportSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    const handleUpdate = async (id, type) => {
        const requestRef = doc(db, type === 'feature' ? 'featureRequests' : 'supportRequests', id);
        const updateData = updates[id] || {};
        if (comments[id]) {
            updateData.comments = arrayUnion({ text: comments[id], timestamp: new Date() });
        }
        await updateDoc(requestRef, updateData);
        alert('Request updated successfully');
        setComments({ ...comments, [id]: "" });
        setUpdates({});
        fetchRequests();
    };

    const handleChange = (id, field, value) => {
        setUpdates({ ...updates, [id]: { ...updates[id], [field]: value } });
    };

    const handleCommentChange = (id, value) => {
        setComments({ ...comments, [id]: value });
    };

    const filteredFeatureRequests = featureRequests.filter(request =>
        request.featureDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.supplementalInfo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSupportRequests = supportRequests.filter(request =>
        request.bugDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.supplementalInfo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderRequests = (requests, type) => (
        requests.map(request => (
            <div key={request.id} className="p-4 mb-4 border rounded-lg shadow bg-gray-800">
                <h3 className="text-xl font-semibold">{request.featureDescription || request.bugDescription}</h3>
                <p className="text-gray-300 mb-2">{request.supplementalInfo}</p>
                <div className="mb-2">
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="priority">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={updates[request.id]?.priority || request.priority || "Low"}
                        onChange={(e) => handleChange(request.id, 'priority', e.target.value)}
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
                        onChange={(e) => handleChange(request.id, 'status', e.target.value)}
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
                <div className="text-gray-400 text-sm mt-2">Submitted by: {request.name}</div>
            </div>
        ))
    );

    return (
        <>
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
                            {renderRequests(filteredFeatureRequests.filter(request => request.status !== 'complete'), 'feature')}
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="text-xl mb-2">Support Requests</h3>
                            {renderRequests(filteredSupportRequests.filter(request => request.status !== 'complete'), 'support')}
                        </div>
                    </div>
                    <h2 className="text-2xl mt-6 mb-4">Complete</h2>
                    <div className="flex justify-between">
                        <div className="w-1/2 pr-2">
                            <h3 className="text-xl mb-2">Feature Requests</h3>
                            {renderRequests(filteredFeatureRequests.filter(request => request.status === 'complete'), 'feature')}
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="text-xl mb-2">Support Requests</h3>
                            {renderRequests(filteredSupportRequests.filter(request => request.status === 'complete'), 'support')}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
