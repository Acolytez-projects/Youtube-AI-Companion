"use client";

import { useState, useEffect } from "react";

import { SendHorizonal, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import Chatbot from "@/components/chatbot";

export default function YouTubePlayer() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const params = useParams();
  const [youtubeId, setYoutubeId] = useState<string>("");
  const videoId = params["youtube"];

  useEffect(() => {
    // You can add video info fetching logic here if needed
    // For now, we'll simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [videoId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const urlArr = Array.from(videoUrl);
    urlArr.reverse();

    const indexOf = urlArr.indexOf("=");
    const idReversed = urlArr.slice(0, indexOf);
    const idArr = idReversed.reverse();
    const urlId = idArr.join("");

    setYoutubeId(urlId);
    setVideoUrl("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Player Section */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={videoUrl}
                          placeholder="Paste Youtube Video URL here..."
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="flex-1 p-3 border w-64 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm disabled:opacity-50"
                        />
                        <button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <SendHorizonal className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
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
                  src={
                    youtubeId === ""
                      ? `https://www.youtube.com/embed/${videoId}`
                      : `https://www.youtube.com/embed/${youtubeId}`
                  }
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>

            {/* Mobile Chat */}
            {showChat && (
              <div className="lg:hidden mt-4">
                <div className="h-96">
                  <Chatbot videoId={youtubeId === "" ? videoId : youtubeId} />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Chat Sidebar */}
          <div className="hidden lg:block w-96">
            <div className="sticky top-8">
              <div className="h-[600px]">
                <Chatbot videoId={youtubeId === "" ? videoId : youtubeId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
