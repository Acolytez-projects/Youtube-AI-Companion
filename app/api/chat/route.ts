import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const openai = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

interface VideoInfo {
  title?: string;
  channelTitle?: string;
  description?: string;
  publishedAt?: string;
  viewCount?: string;
}

async function getVideoInfo(videoId: string): Promise<VideoInfo | null> {
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn("YouTube API key not provided");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,statistics`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        title: video.snippet?.title,
        channelTitle: video.snippet?.channelTitle,
        description: video.snippet?.description,
        publishedAt: video.snippet?.publishedAt,
        viewCount: video.statistics?.viewCount,
      };
    }
  } catch (error) {
    console.error("YouTube API error:", error);
  }

  return null;
}

function createSystemPrompt(videoId: string, videoInfo: VideoInfo | null): string {
  if (videoInfo) {
    const { title, channelTitle, description, publishedAt, viewCount } = videoInfo;
    
    return `You are a helpful AI assistant discussing this YouTube video:

**Video Details:**
- Title: ${title}
- Channel: ${channelTitle}
- Published: ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unknown'}
- Views: ${viewCount ? parseInt(viewCount).toLocaleString() : 'Unknown'}
- Description: ${description ? description.substring(0, 800) + (description.length > 800 ? '...' : '') : 'No description available'}

**Instructions:**
- Help users understand and discuss this video content based on the information provided
- Answer questions about the video's topic, channel, and content
- If asked about specific details not in the description, acknowledge your limitations
- Be conversational and helpful
- Reference the video naturally in your responses when relevant
- Keep responses concise but informative`;
  }

  return `You are a helpful AI assistant discussing a YouTube video with ID: ${videoId}.

**Instructions:**
- Help users understand and discuss the content of this specific video
- You can reference the video URL: https://www.youtube.com/watch?v=${videoId}
- If you don't have specific information about the video content, be honest about your limitations
- Ask clarifying questions to better help the user
- Be conversational and helpful
- Keep responses concise but informative`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, videoId } = await req.json();

    // Validation
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER API KEY" },
        { status: 500 }
      );
    }

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get video information
    const videoInfo = await getVideoInfo(videoId);
    const systemContent = createSystemPrompt(videoId, videoInfo);

    // Stream response
    const result = await streamText({
      model: openai("openai/gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        ...messages,
      ],
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "YouTube-Chatbot",
      },
      temperature: 0.7,
      maxTokens: 1000,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}