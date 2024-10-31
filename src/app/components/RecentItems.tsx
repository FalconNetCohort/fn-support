import React, {useState, useEffect} from 'react';
import {db} from "@/app/firebase";
import {collection, getDocs} from "firebase/firestore";

interface UserGuide {
    id: string;
    title: string;
    body: string;
    lastUpdated: string;
}


export default function RecentItems() {
    const [userGuides, setUserGuides] = useState<UserGuide[] | null>(null);


    const fetchUserGuides = async () => {
        const userGuidesRef = await getDocs(collection(db, 'userGuides'));
        setUserGuides(userGuidesRef.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserGuide)));
    };

    useEffect(() => {
        fetchUserGuides();
    }, []);

    return (
        <div>
            <div className="mb-8 grid mx-auto gap-8 grid-cols-4">
                {userGuides && userGuides.map((guide) => (
                    <div
                        key={guide.id}
                        className="p-16 mb-4 border rounded-lg cursor-pointer bg-gray-800"

                    >
                        <h2 className="mb-2 text-xl font-semibold text-white">{guide.title}</h2>
                        <p className="text-gray-400">{guide.lastUpdated}</p>

                    </div>
                ))}
            </div>
        </div>
    );

}