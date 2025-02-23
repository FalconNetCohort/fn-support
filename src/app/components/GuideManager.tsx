"use client";

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import RichTextEditor from "./RichTextEditor";
import Modal from "./Modal";

interface UserGuide {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    lastUpdated: Date;
    createdBy?: string;
}

interface GuideManagerProps {
    searchEnabled?: boolean; // Enable search bar
    adminMode?: boolean; // If true, allows creating, editing, and deleting guides
    showLimited?: boolean; // If true, only show a limited number of guides
}

const GuideManager: React.FC<GuideManagerProps> = ({ searchEnabled = false, adminMode = false, showLimited = false }) => {
    const [guides, setGuides] = useState<UserGuide[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGuide, setSelectedGuide] = useState<UserGuide | null>(null);
    const [editingGuide, setEditingGuide] = useState<UserGuide | null>(null);
    const [newGuide, setNewGuide] = useState<UserGuide | null>(null); // Separate state for new guides
    const [filteredGuides, setFilteredGuides] = useState<UserGuide[]>([]);

    // Fetch metadata only
    const fetchGuideMetadata = async () => {
        try {
            console.log("📌 Fetching guide metadata...");
            const querySnapshot = await getDocs(collection(db, "userGuides"));

            if (querySnapshot.empty) console.warn("⚠️ No guides found in Firestore.");

            let guideList = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data.title || "Untitled",
                    content: "", // Empty until fetched dynamically
                    tags: data.tags || [],
                    lastUpdated: data.lastUpdated ? (data.lastUpdated.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)) : new Date(), // Convert Firestore Timestamp to Date
                    createdBy: data.createdBy || "FalconNet Admin",
                };
            });
            // 🔹 Sort guides by lastUpdated (newest first)
            guideList.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

            console.log("✅ Retrieved guides:", guideList);
            setGuides(guideList);
            setFilteredGuides(guideList); // Initially, display all guides
        } catch (error) {
            console.error("❌ Error fetching guide metadata:", error);
        }
    };

    // Fetch full guide content when clicked
    const fetchGuideById = async (guideId: string) => {
        try {
            console.log(`📌 Fetching content for guide ID: ${guideId}`);
            const guideRef = doc(db, "userGuides", guideId);
            const guideSnap = await getDoc(guideRef);

            if (!guideSnap.exists()) {
                console.warn(`⚠️ Guide not found: ${guideId}`);
                return null;
            }

            return {
                id: guideId,
                title: guideSnap.data().title || "Untitled",
                content: guideSnap.data().content || "<p>No content available.</p>",
                tags: guideSnap.data().tags || [],
                lastUpdated: guideSnap.data().lastUpdated ? (guideSnap.data().lastUpdated.toDate ? guideSnap.data().lastUpdated.toDate() : new Date(guideSnap.data().lastUpdated)) : new Date(),
                createdBy: guideSnap.data().createdBy || "",
            };
        } catch (error) {
            console.error("❌ Error fetching guide content:", error);
            return null;
        }
    };

    // Handle clicking a guide
    const handleGuideClick = async (guide: UserGuide) => {
        const fullGuide = await fetchGuideById(guide.id);
        if (fullGuide) setSelectedGuide(fullGuide);
    };

    // Handle creating a new guide
    const handleCreate = () => {
        setNewGuide({id: "", title: "", content: "", tags: [], createdBy: "", lastUpdated: new Date()});
    };

    // Handle saving a new guide
    const handleSaveNewGuide = async () => {
        if (!newGuide) return;
        try {
            const docRef = await addDoc(collection(db, "userGuides"), {
                title: newGuide.title,
                content: newGuide.content,
                tags: newGuide.tags,
                lastUpdated: new Date(),
                createdBy: newGuide.createdBy,
            });
            console.log(`✅ Guide created: ${docRef.id}`);
            setNewGuide(null); // Clear the form after saving
            fetchGuideMetadata(); // Refresh guide list
        } catch (error) {
            console.error("❌ Error creating guide:", error);
        }
    };

    // Handle saving an edited guide
    const handleSaveEdit = async () => {
        if (!editingGuide) return;
        try {
            await updateDoc(doc(db, "userGuides", editingGuide.id), {
                title: editingGuide.title,
                content: editingGuide.content,
                tags: editingGuide.tags,
                lastUpdated: new Date(),
            });
            console.log(`✅ Guide updated: ${editingGuide.id}`);
            setEditingGuide(null);
            fetchGuideMetadata(); // Refresh guide list
        } catch (error) {
            console.error("❌ Error updating guide:", error);
        }
    };

    const handleEdit = async (guide: UserGuide) => {
        console.log(`📌 Editing guide ID: ${guide.id}`);
        const fullGuide = await fetchGuideById(guide.id);
        if (fullGuide) setEditingGuide(fullGuide);
    };

    // Handle deleting a guide
    const handleDelete = async (guideId: string) => {
        if (!confirm("Are you sure you want to delete this guide?")) return;

        try {
            await deleteDoc(doc(db, "userGuides", guideId));
            console.log(`✅ Guide deleted: ${guideId}`);
            fetchGuideMetadata(); // Refresh guide list
        } catch (error) {
            console.error("❌ Error deleting guide:", error);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);

        if (query.length > 0) {
            const filteredResults = guides.filter((guide) =>
                guide.title.toLowerCase().includes(query) ||
                (guide.tags && guide.tags.some((tag) => tag.toLowerCase().includes(query)))
            );
            setFilteredGuides(filteredResults);
        } else {
            setFilteredGuides(guides);
        }
    };

    const displayedGuides = showLimited && searchTerm.length === 0
        ? filteredGuides.slice(0, 5) // Show only 5 guides on homepage
        : filteredGuides; // Show all guides when searching

    useEffect(() => {
        fetchGuideMetadata();
    }, []);

    return (
        <div className="p-6">
            {searchEnabled && (
                <input
                    type="text"
                    placeholder="Search for FAQs or user guides..."
                    className="w-full p-4 mb-6 border border-gray-700 rounded-lg text-black bg-neutral-900"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            )}

            {adminMode && !newGuide && (
                <button onClick={handleCreate} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 mb-4">
                    + Create New Guide
                </button>
            )}

            {/* Inline form for creating a new guide */}
            {newGuide && (
                <div className="bg-gray-900 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
                    <h2 className="text-2xl mb-4">Create New Guide</h2>
                    <input
                        type="text"
                        value={newGuide.title}
                        onChange={(e) => setNewGuide({ ...newGuide, title: e.target.value })}
                        placeholder="Guide Title"
                        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
                    />
                    <input
                        type="text"

                        value={newGuide?.tags?.join(", ") || ""}
                        onChange={(e) => setNewGuide({ ...newGuide, tags: e.target.value.split(", ") })}
                        placeholder="Tags (comma-separated)"
                        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
                    />
                    <RichTextEditor content={newGuide.content} setContent={(content) => setNewGuide({ ...newGuide, content })} />
                    <button onClick={handleSaveNewGuide} className="bg-blue-600 text-white px-3 py-2 mt-4 rounded hover:bg-blue-700">
                        Save Guide
                    </button>
                    <button onClick={() => setNewGuide(null)} className="ml-2 bg-red-600 text-white px-3 py-2 mt-4 rounded hover:bg-red-700">
                        Cancel
                    </button>
                </div>
            )}

            {selectedGuide && (
                <Modal
                    isOpen={!!selectedGuide}
                    onClose={() => setSelectedGuide(null)}
                    title={selectedGuide.title}
                    content={selectedGuide.content}
                />
            )}

            {editingGuide && (
                <div className="bg-gray-900 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl mb-4">Edit Guide</h2>
                    <input
                        type="text"
                        value={editingGuide.title}
                        onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                        placeholder="Guide Title"
                        className="w-full p-2 mb-4 bg-gray-800 text-white rounded break-words"
                    />
                    <input
                        type="text"
                        value={editingGuide?.tags?.join(", ") || ""}
                        onChange={(e) => setNewGuide({ ...editingGuide, tags: e.target.value.split(", ") })}
                        placeholder="Tags (comma-separated)"
                        className="w-full p-2 mb-4 bg-gray-800 text-white rounded break-words"
                    />
                    <RichTextEditor content={editingGuide.content} setContent={(content) => setEditingGuide({ ...editingGuide, content })} />
                    <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-3 py-2 mt-4 rounded hover:bg-blue-700 break-words">
                        Save Changes
                    </button>
                    <button onClick={() => setEditingGuide(null)} className="ml-2 bg-red-600 text-white px-3 py-2 mt-4 rounded hover:bg-red-700">
                        Cancel
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayedGuides.map((guide) => (
                    <div key={guide.id} className="p-4 mb-4 border rounded-lg cursor-pointer bg-gray-800">
                        <h2 className="mb-2 text-xl font-semibold text-white break-words" onClick={() => handleGuideClick(guide)}>
                            {guide.title}
                        </h2>
                        <p className="text-sm text-gray-400 break-words">
                            {guide.tags?.join(" ") || ""}
                        </p>
                        {/* Admin-only buttons inside each guide */}
                        {adminMode && (
                            <div>
                                <p className="text-sm text-gray-400 break-words">
                                    Last updated: {guide.lastUpdated.toLocaleString()}
                                </p>
                                <div className="mt-2 flex-wrap flex space-x-2">
                                    <button onClick={() => handleEdit(guide)} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(guide.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuideManager;
