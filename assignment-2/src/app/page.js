"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  const handleExplore = () => {
   router.push("/main");
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 text-white px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-5xl font-bold leading-tight">
          Welcome to AI Blog Summarizer
        </h1>
        <p className="text-lg text-gray-200">
          Quickly summarize, translate, and save blogs using the power of AI.
        </p>
        <Button
          onClick={handleExplore}
          className="bg-white text-indigo-700 font-semibold text-lg px-8 py-3 rounded-full hover:bg-gray-100 transition-all hover:cursor-pointer hover:text-3xl"
        >
          🚀 Explore Today’s Blogs
        </Button>
      </div>
    </main>
  );
}
