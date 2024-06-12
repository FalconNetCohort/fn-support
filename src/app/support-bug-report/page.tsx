"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SupportBugReport() {
    const [formData, setFormData] = useState({
        name: "",
        rank: "",
        email: "",
        jobTitle: "",
        bugDescription: "",
        supplementalInfo: "",
        chainOfCommand: "no",
    });
    const [attachment, setAttachment] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic
        console.log("Form data:", formData);
        console.log("Attachment:", attachment);
    };

    return (
        <>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center p-6">
                <h1 className="text-3xl mb-6">Support/Bug Report Form</h1>
                <form className="w-full max-w-lg" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rank">
                            Rank
                        </label>
                        <input
                            type="text"
                            name="rank"
                            id="rank"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.rank}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="jobTitle"
                            id="jobTitle"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.jobTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bugDescription">
                            Bug Description
                        </label>
                        <textarea
                            name="bugDescription"
                            id="bugDescription"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.bugDescription}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attachment">
                            Attachment
                        </label>
                        <input
                            type="file"
                            name="attachment"
                            id="attachment"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplementalInfo">
                            Supplemental Info
                        </label>
                        <textarea
                            name="supplementalInfo"
                            id="supplementalInfo"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.supplementalInfo}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chainOfCommand">
                            Has this info been sent up the chain of command?
                        </label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                name="chainOfCommand"
                                value="yes"
                                checked={formData.chainOfCommand === "yes"}
                                onChange={handleChange}
                            />
                            <span className="ml-2">Yes</span>
                            <input
                                type="radio"
                                name="chainOfCommand"
                                value="no"
                                checked={formData.chainOfCommand === "no"}
                                onChange={handleChange}
                                className="ml-6"
                            />
                            <span className="ml-2">No</span>
                        </div>
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
        </>
    );
}
