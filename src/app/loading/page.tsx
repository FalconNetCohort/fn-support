import React from 'react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium text-blue-200 animate-pulse">
                    Loading the page...
                </p>
            </div>
        </div>
    );
}
