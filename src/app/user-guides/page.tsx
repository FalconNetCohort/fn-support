"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { db, analytics, logEvent, auth } from "../firebase";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import MarkdownIt from "markdown-it";

const mdParser = new MarkdownIt();

export default function UserGuides() {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        tags: [],
    });
    const [userGuides, setUserGuides] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [inputTag, setInputTag] = useState("");
    const tagInputRef = useRef(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const router = useRouter();

    useEffect(() => {
        logEvent(analytics, "user_guides_page_view");
        fetchUserGuides();
    }, []);

    const fetchUserGuides = async () => {
        const userGuidesSnapshot = await getDocs(collection(db, "userGuides"));
        setUserGuides(userGuidesSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            tags: doc.data().tags || [],
        })));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBodyChange = (e) => {
        setFormData({ ...formData, body: e.target.value });
    };

    const handleTagChange = (e) => {
        setInputTag(e.target.value);
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputTag.trim();
            if (newTag && !formData.tags.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...prev.tags, newTag],
                }));
            }
            setInputTag("");
        }
    };

    const handleTagDelete = (tagToDelete) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToDelete),
        }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".md")) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({ ...prev, body: reader.result }));
            };
            reader.readAsText(file);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                setFormData((prev) => ({
                    ...prev,
                    body: prev.body + `\n![Image](${imageUrl})\n`,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const guideRef = editingId ? doc(db, "userGuides", editingId) : collection(db, "userGuides");
            const now = new Date().toISOString();
            if (editingId) {
                await updateDoc(guideRef, {
                    ...formData,
                    lastUpdated: now,
                });
            } else {
                await addDoc(guideRef, {
                    ...formData,
                    created: now,
                    lastUpdated: now,
                });
            }
            logEvent(analytics, editingId ? "user_guide_update" : "user_guide_create", { title: formData.title });
            alert(`User guide ${editingId ? "updated" : "created"} successfully!`);
            clearForm();
            fetchUserGuides();
        } catch (err) {
            console.error(err);
            alert(`Error ${editingId ? "updating" : "creating"} user guide`);
        }
    };

    const clearForm = () => {
        setFormData({
            title: "",
            body: "",
            tags: [],
        });
        setEditingId(null);
        setInputTag("");
    };

    const handleEdit = (guide) => {
        setFormData({
            title: guide.title,
            body: guide.body,
            tags: guide.tags,
        });
        setEditingId(guide.id);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this guide?")) {
            try {
                await deleteDoc(doc(db, "userGuides", id));
                logEvent(analytics, "user_guide_delete", { id });
                alert("User guide deleted successfully!");
                fetchUserGuides();
            } catch (err) {
                console.error(err);
                alert("Error deleting user guide");
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
    };

    const handleCloseModal = () => {
        setSelectedResult(null);
    };

    return (
        <AuthWrapper>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
                <div className="w-full max-w-lg flex justify-between items-center mb-6">
                    <h1 className="text-3xl">User Guides</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                    >
                        Logout
                    </button>
                </div>
                <form className="w-full max-w-lg mb-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="tags">
                            Tags
                        </label>
                        <div className="flex items-center flex-wrap mb-2">
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleTagDelete(tag)}
                                        className="ml-2 text-white bg-red-600 rounded-full px-1 hover:bg-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <input
                                type="text"
                                value={inputTag}
                                onChange={handleTagChange}
                                onKeyDown={handleTagKeyDown}
                                ref={tagInputRef}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter a tag and press Enter"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="body">
                            Body
                        </label>
                        <textarea
                            name="body"
                            id="body"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.body}
                            onChange={handleBodyChange}
                            required
                            rows="10"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="mdFile">
                            Upload Markdown File
                        </label>
                        <input
                            type="file"
                            name="mdFile"
                            id="mdFile"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="imageFile">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            name="imageFile"
                            id="imageFile"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            {editingId ? "Update Guide" : "Create Guide"}
                        </button>
                    </div>
                </form>
                <div className="w-full max-w-lg mt-6">
                    <h2 className="text-2xl mb-4">Existing Guides</h2>
                    {userGuides.length === 0 ? (
                        <div className="text-gray-400">No user guides yet</div>
                    ) : (
                        userGuides.map((guide) => (
                            <div key={guide.id} className="p-4 mb-4 border rounded-lg shadow bg-gray-800">
                                <h3 className="text-xl font-semibold">{guide.title}</h3>
                                <div className="flex items-center flex-wrap mb-2">
                                    {Array.isArray(guide.tags) ? (
                                        guide.tags.map((tag, index) => (
                                            <div key={index} className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
                                                <span>{tag}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-400">No tags</div>
                                    )}
                                </div>
                                <div className="text-gray-400 text-sm">Last Updated: {new Date(guide.lastUpdated).toLocaleString()}</div>
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        onClick={() => handleEdit(guide)}
                                        className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guide.id)}
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {selectedResult && (
                    <Modal
                        isOpen={!!selectedResult}
                        onClose={handleCloseModal}
                        title={selectedResult.title}
                        content={mdParser.render(selectedResult.body)}
                    />
                )}
            </main>
            <Footer />
        </AuthWrapper>
    );
}
