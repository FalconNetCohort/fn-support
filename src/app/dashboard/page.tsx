"use client";
import React, {useState, useEffect, Suspense} from "react";
import { useRouter } from "next/navigation";
import { User, getAuth } from "firebase/auth";
import { db, auth } from "../firebase";
import { get, child, ref, update, remove } from "firebase/database";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminAuthWrapper from "../components/AdminAuthWrapper";
import Loading from "@/app/loading/page";

// Define types for requests
interface Request {
  id: string;
  title?: string;
  description: string;
  priority?: string;
  comments?: any[];
  status?: string;
  userName: string;
  userRank: string;
  userEmail: string;
  jobTitle: string;
}

interface UpdateData {
  priority?: string;
  status?: string;
  comments?: any;
}

interface CommentData {
  [key: string]: string;
}

function DashboardContent() {
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
        fetchRequests().then((r) => r);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const dbRef = ref(db);
      const featureSnapshot = await get(child(dbRef, "featureRequests"));
      const supportSnapshot = await get(child(dbRef, "supportRequests"));

      const featureData = featureSnapshot.exists() ? featureSnapshot.val() : {};
      const supportData = supportSnapshot.exists() ? supportSnapshot.val() : {};

      const formatRequests = (data: any): Request[] =>
          Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

      setFeatureRequests(formatRequests(featureData));
      setSupportRequests(formatRequests(supportData));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleUpdate = async (id: string, type: "feature" | "support") => {
    try {
      const requestPath = `${type === "feature" ? "featureRequests" : "supportRequests"}/${id}`;
      const requestRef = ref(db, requestPath);

      const updateData: UpdateData = updates[id] || {};
      const user = getAuth().currentUser;

      if (!user) {
        alert("You must be logged in to update a post.");
        return;
      }

      if (comments[id]) {
        // Fetch existing comments
        const snapshot = await get(child(ref(db), requestPath));
        const requestData = snapshot.exists() ? snapshot.val() : {};

        const currentComments = requestData.comments || [];

        // Append new comment with user details
        const newComment = {
          text: comments[id],
          authorEmail: user.email || "FN Admin",
          timestamp: Date.now(),
        };

        await update(requestRef, {
          ...updateData,
          comments: [...currentComments, newComment],
        });
      } else {
        await update(requestRef, updateData);
      }

      alert("Request updated successfully!");
      setComments({ ...comments, [id]: "" });
      setUpdates({});
      await fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request");
    }
  };

  const handleDelete = async (id: string, type: "feature" | "support") => {
    try {
      const requestPath = `${type === "feature" ? "featureRequests" : "supportRequests"}/${id}`;
      const requestRef = ref(db, requestPath);

      await remove(requestRef);

      alert("Request deleted successfully!");
      await fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Error deleting request");
    }
  };

  const handleChange = async (
      id: string,
      field: keyof UpdateData,
      value: string,
      type: "feature" | "support"
  ) => {
    try {
      const requestPath = `${type === "feature" ? "featureRequests" : "supportRequests"}/${id}`;
      const requestRef = ref(db, requestPath);

      // Immediately update Firebase with the new value
      await update(requestRef, { [field]: value });

      // Update UI state by modifying the appropriate request list
      setFeatureRequests((prev) =>
          prev.map((request) =>
              request.id === id ? { ...request, [field]: value } : request
          )
      );

      setSupportRequests((prev) =>
          prev.map((request) =>
              request.id === id ? { ...request, [field]: value } : request
          )
      );

    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request");
    }
  };



  const handleCommentChange = (id: string, value: string) => {
    setComments({
      ...comments, [id]: value });
  };

  const filteredFeatureRequests = featureRequests.filter(
    (request) =>
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupportRequests = supportRequests.filter(
    (request) =>
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pick color based on status
    const statusColor = (status: string) => {
        switch (status) {
        case "complete":
            return "bg-green-600";
        case "in-progress":
            return "bg-yellow-600";
        default:
            return "bg-gray-600";
        }
    };


  const renderRequests = (requests: Request[], type: "feature" | "support") =>
    requests.length === 0 ? (
      <div className="text-gray-400 text-center">No posts yet</div>
    ) : (
      requests.map((request) => (
        <div
          key={request.id}
          className="p-4 mb-4 border rounded-lg shadow bg-gray-800"
        >
          <h3 className="text-xl font-semibold break-words">{request.title}</h3>
          <p className="text-gray-300 mb-2 break-words">{request.description}</p>
          <div className="mb-2">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              id="priority"
              value={updates[request.id]?.priority || request.priority || "Low"}
              onChange={(e) =>
                handleChange(request.id, "priority", e.target.value, type)
              }
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              value={
                updates[request.id]?.status || request.status || "in-progress"
              }
              onChange={(e) =>
                handleChange(request.id, "status", e.target.value, type)
              }
              className={`px-2 py-1 rounded-lg text-sm text-white ${
                statusColor(updates[request.id]?.status || request.status || "in-progress")
              } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            >
                <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="mb-2">
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            {request.comments?.map((comment: any, index: number) => (
              <div
                key={index}
                className="p-2 mb-2 border rounded-lg bg-gray-700"
              >
                <div className="text-gray-300">{comment.text}</div>
                <div className="text-gray-400 text-sm">{comment.authorEmail}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(comment.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-2">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="comment"
            >
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
            Post Comment
          </button>
          <button
            onClick={() => handleDelete(request.id, type)}
            className="mt-2 ml-2 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
          <div className="text-gray-400 text-sm mt-2 break-words">
            <br /> Submitted by:
            <br /> Name: {request.userRank} {request.userName}
            <br/> Job Title: {request.jobTitle}
            <br/> Email: {request.userEmail}
          </div>
        </div>
      ))
    );

  return (
    <AdminAuthWrapper>
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
          <h2 className="text-2xl mb-4 text-center">Pending</h2>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-xl mb-2 text-center">Feature Requests</h3>
              {renderRequests(
                  filteredFeatureRequests.filter(
                      (request) => request.status === "pending"
                  ),
                  "feature"
              )}
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-xl mb-2 text-center">Support Requests</h3>
              {renderRequests(
                  filteredSupportRequests.filter(
                      (request) => request.status === "pending"
                  ),
                  "support"
              )}
            </div>
          </div>

          <hr className="my-6 border-t border-gray-700" />

          <h2 className="text-2xl mt-6 mb-4 text-center">In Progress</h2>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-xl mb-2 text-center">Feature Requests</h3>
              {renderRequests(
                  filteredFeatureRequests.filter(
                      (request) => request.status === "in-progress"
                  ),
                  "feature"
              )}
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-xl mb-2 text-center">Support Requests</h3>
              {renderRequests(
                  filteredSupportRequests.filter(
                      (request) => request.status === "in-progress"
                  ),
                  "support"
              )}
            </div>
          </div>

          <hr className="my-6 border-t border-gray-700" />

          <h2 className="text-2xl mt-6 mb-4 text-center">Completed</h2>
          <div className="flex justify-between">
            <div className="w-1/2 pr-2">
              <h3 className="text-xl mb-2 text-center">Feature Requests</h3>
              {renderRequests(
                  filteredFeatureRequests.filter(
                      (request) => request.status === "complete"
                  ),
                  "feature"
              )}
            </div>
            <div className="w-1/2 pl-2">
              <h3 className="text-xl mb-2 text-center">Support Requests</h3>
              {renderRequests(
                  filteredSupportRequests.filter(
                      (request) => request.status === "complete"
                  ),
                  "support"
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </AdminAuthWrapper>
  );
}

const Dashboard = () => {
  return (
      <Suspense fallback={<Loading />}>
        <DashboardContent />
      </Suspense>
  );
};

export default Dashboard;