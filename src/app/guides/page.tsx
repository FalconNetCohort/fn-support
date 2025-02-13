"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  DocumentReference,
  CollectionReference,
  serverTimestamp,
} from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import MarkdownIt from "markdown-it";
import AdminAuthWrapper from "../components/AdminAuthWrapper";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

const mdParser = new MarkdownIt();

interface UserGuide {
  id: string;
  title: string;
  fileUrl: string;
  tags: string[];
  lastUpdated?: string;
  createdBy?: string;
}


export default function UserGuides() {
  const [formData, setFormData] = useState({
    title: "",
    tags: [] as string[],
  });
  const [userGuides, setUserGuides] = useState<UserGuide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputTag, setInputTag] = useState("");
  const tagInputRef = useRef(null);
  const [selectedResult, setSelectedResult] = useState<UserGuide | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserGuides().then(() => {
      console.log("User guides fetched successfully");
    });
  }, []);

  const fetchUserGuides = async (): Promise<void> => {
    const userGuidesSnapshot = await getDocs(collection(db, "userGuides"));
    setUserGuides(
        userGuidesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          fileUrl: doc.data().fileUrl || "", // Ensure fileUrl is included
          tags: doc.data().tags || [],
          lastUpdated: doc.data().lastUpdated || "",
          createdBy: doc.data().createdBy || "",
        })) as UserGuide[]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTag(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleTagDelete = (tagToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith(".md")) {
      alert("Please upload a valid Markdown (.md) file.");
      return;
    }

    const storageRef = ref(storage, `guideFiles/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          alert("File upload failed. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Store guide metadata in Firestore
          await addDoc(collection(db, "userGuides"), {
            title: file.name.replace(".md", ""),
            fileUrl: downloadURL, // Store file URL
            tags: [],
            lastUpdated: new Date().toISOString(),
            createdBy: "FalconNet Admin",
          });

          alert("Markdown guide uploaded successfully!");
          fetchUserGuides(); // Refresh guides list
        }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `guideImages/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading image:", error);
          alert("Image upload failed. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          alert("Image uploaded successfully! Use this link in your Markdown: " + downloadURL);
        }
    );
  };

  const handleGuideClick = (guide: UserGuide) => {
    setSelectedResult(guide); // Store only the guide metadata
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const now = new Date().toISOString();

      if (editingId) {
        // UPDATE existing guide in Firestore
        const guideRef = doc(db, "userGuides", editingId);
        await updateDoc(guideRef, {
          title: formData.title,
          tags: formData.tags,
          lastUpdated: now,
        });
        alert("Guide updated successfully!");
      } else {
        // CREATE a new guide in Firestore
        await addDoc(collection(db, "userGuides"), {
          title: formData.title,
          tags: formData.tags,
          fileUrl: "", // Set fileUrl when uploading file
          createdAt: now,
          lastUpdated: now,
        });
        alert("Guide created successfully!");
      }

      clearForm();
      fetchUserGuides();
    } catch (error) {
      console.error("Error saving guide:", error);
      alert("Failed to save guide.");
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      tags: [],
    });
    setEditingId(null);
    setInputTag("");
  };


  const handleEdit = (guide: UserGuide) => {
    setFormData({
      title: guide.title,
      tags: guide.tags,
    });
    setEditingId(guide.id);
  };

  const handleDelete = async (guide: UserGuide) => {
    if (!confirm(`Are you sure you want to delete "${guide.title}"?`)) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "userGuides", guide.id));

      // Delete file from Firebase Storage
      if (guide.fileUrl) {
        const fileRef = ref(storage, guide.fileUrl);
        await deleteObject(fileRef);
      }

      alert("Guide deleted successfully!");
      fetchUserGuides(); // Refresh guides list
    } catch (error) {
      console.error("Error deleting guide:", error);
      alert("Failed to delete guide.");
    }
  };

  const handleCloseModal = () => {
    setSelectedResult(null);
  };

  return (
    <AdminAuthWrapper>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
        <div className="w-full max-w-lg flex justify-between items-center mb-6">
          <h1 className="text-3xl">User Guides</h1>
        </div>
        <form className="w-full max-w-lg mb-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="title"
            >
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
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              Tags
            </label>
            <div className="flex items-center flex-wrap mb-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-600 text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
                >
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
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="mdFile"
            >
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
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="imageFile"
            >
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
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              {editingId ? "Update Guide" : "Create Guide"}
            </button>
          </div>
        </form>
        <div className="w-full max-w-lg mt-6">
          <h2 className="text-2xl mb-4">Existing Guides</h2>
          {userGuides.map((guide) => (
              <div
                  key={guide.id}
                  className="p-4 mb-4 border rounded-lg shadow bg-gray-800 flex justify-between items-center"
              >
                <h3
                    className="text-xl font-semibold cursor-pointer"
                    onClick={() => handleGuideClick(guide)}
                >
                  {guide.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                      onClick={() => handleEdit(guide)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                      onClick={() => handleDelete(guide)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
          ))}

        </div>
        {selectedResult && (
            <Modal
                isOpen={!!selectedResult}
                onClose={handleCloseModal}
                title={selectedResult.title}
                fileUrl={selectedResult.fileUrl}
            />
        )}
      </main>
      <Footer />
    </AdminAuthWrapper>
  );
}
