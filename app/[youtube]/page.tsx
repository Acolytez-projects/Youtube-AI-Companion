"use client";

import { useState, useEffect } from "react";

import { Play, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import Chatbot from "@/components/chatbot";

export default function YouTubePlayer() {
  const [videoInfo, setVideoInfo] = useState<{
    title?: string;
    channelTitle?: string;
    description?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const params = useParams();
  const videoId = params["youtube"];

  useEffect(() => {
    // You can add video info fetching logic here if needed
    // For now, we'll simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [videoId]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Player Section */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white">Loading video...</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                      Youtube Video
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Play className="w-4 h-4" />
                      <span className="text-sm">
                        {videoInfo.channelTitle || "YouTube Channel"}
                      </span>
                    </div>
                    {videoInfo.description && (
                      <div className="text-gray-700 text-sm">
                        <p className="line-clamp-3">{videoInfo.description}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Chat Toggle */}
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="lg:hidden bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Chat */}
            {showChat && (
              <div className="lg:hidden mt-4">
                <div className="h-96">
                  <Chatbot videoId={videoId} />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Chat Sidebar */}
          <div className="hidden lg:block w-96">
            <div className="sticky top-8">
              <div className="h-[600px]">
                <Chatbot videoId={videoId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}