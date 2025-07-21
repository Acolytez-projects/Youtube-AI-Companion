'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Play, Clock, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoSnippet {
  title: string;
  description: string;
  thumbnails: {
    high: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
  };
  channelTitle: string;
  publishedAt: string;
}

interface VideoItem {
  id: { videoId: string };
  etag: string;
  snippet: VideoSnippet;
}

export default function Home() {
  const key = process.env.NEXT_PUBLIC_YOUTUBE_API; // Replace with your actual API key

  const router = useRouter();

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchVideos = useCallback(async (query: string) => {
    if (!query.trim() || !key) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=12&key=${key}`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      setVideos(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (activeSearch) {
      fetchVideos(activeSearch);
    }
  }, [activeSearch, fetchVideos]);

  const handleSubmit = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  }, [searchQuery]);

  const handleVideoClick = useCallback((videoId: string) => {
    router.push(`/${videoId}`);
  }, [router]);

  const formatTimeAgo = useMemo(() => {
    return (publishedAt: string) => {
      const now = new Date();
      const published = new Date(publishedAt);
      const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays}d ago`;
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths}mo ago`;
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears}y ago`;
    };
  }, []);

  const truncateText = useCallback((text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center pt-12 pb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 animate-pulse"></div>
              <Play className="relative w-12 h-12 text-red-500 fill-current" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              YouTube
            </h1>
          </div>
          
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-800/80 backdrop-blur-sm rounded-2xl p-2">
              <Search className="w-5 h-5 text-slate-400 ml-4" />
              <input
                type="text"
                placeholder="Search for videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="flex-1 bg-transparent text-white placeholder-slate-400 px-4 py-3 focus:outline-none text-lg"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !searchQuery.trim()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <span className="text-xl">Searching videos...</span>
            </div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.etag}
                onClick={() => handleVideoClick(video.id.videoId)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-red-500/50 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <div className="bg-red-500 p-3 rounded-full shadow-lg">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                      {truncateText(video.snippet.title, 60)}
                    </h3>
                    
                    <p className="text-slate-400 text-xs mb-3 line-clamp-1">
                      {video.snippet.channelTitle}
                    </p>
                    
                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(video.snippet.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Watch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeSearch && !isLoading ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-xl mb-4">No videos found</div>
            <p className="text-slate-500">Try searching for something else</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-slate-400 text-xl mb-4">Start exploring</div>
            <p className="text-slate-500">Search for your favorite videos</p>
          </div>
        )}
      </div>
    </div>
  );
}