"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthWrapper from "@/app/components/AuthWrapper";
import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db } from "@/app/firebase";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getAuth } from "firebase/auth";
import Loading from "@/app/loading/page";

const RequestsPageContent = () => {
    const searchParams = useSearchParams();
    const requestType = searchParams.get("type");

    if (!requestType) {
        return <div>Invalid request type</div>;
    }

    const [formData, setFormData] = useState({
        userName: "",
        userRank: "",
        userEmail: getAuth().currentUser?.email,
        jobTitle: "",
        title: "",
        description: "",
        userId: getAuth().currentUser?.uid,
    });
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttachment(e.target.files && e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const requestRef = push(ref(db, requestType)); // Generate unique key
            await set(requestRef, {
                ...formData,
                attachment: attachment ? attachment.name : "",
                timestamp: Date.now(), // Store submission time
            });

            alert("Support request submitted successfully!");
            clearForm();
        } catch (err) {
            console.error("Error submitting support request:", err);
            alert("Error submitting support request");
        }
    };

    const clearForm = () => {
        setFormData({
            userName: "",
            userRank: "",
            userEmail: getAuth().currentUser?.email,
            jobTitle: "",
            title: "",
            description: "",
            userId: getAuth().currentUser?.uid,
        });
        setAttachment(null);
    };

    const nameType = requestType === "supportRequests" ? "Bug Report" : "Feature Request";

    return (
        <AuthWrapper>
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center p-6">
                    <h1 className="text-3xl mb-6">{nameType}</h1>
                    <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                        <div className={"mb-4 text-center text-lg"}>
                            User Information
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="userName">
                                Your Name
                            </label>
                            <input
                                type="text"
                                name="userName"
                                id="userName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="userRank">
                                Your Rank
                            </label>
                            <input
                                type="text"
                                name="userRank"
                                id="userRank"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.userRank}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="jobTitle">
                                Your Job Title
                            </label>
                            <input
                                type="text"
                                name="jobTitle"
                                id="jobTitle"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.jobTitle}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={"my-4 text-center text-lg"}>
                            {nameType} Information
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="title">
                                {nameType} Title
                            </label>
                            <input
                                name="title"
                                id="title"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="attachment">
                                Attachment
                            </label>
                            <input
                                type="file"
                                name="attachment"
                                id="attachment"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-neutral-100 text-sm font-bold mb-2" htmlFor="description">
                                {nameType} Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </main>
                <Footer />
            </div>
        </AuthWrapper>
    );
};

const RequestsPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <RequestsPageContent />
        </Suspense>
    );
};

export default RequestsPage;
