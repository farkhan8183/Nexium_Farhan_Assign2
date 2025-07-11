"use client";

import { BLOG_DATA } from "@/lib/constants";
import { BlogCard } from "./components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { scrapeBlogText, generateSummary, translateToUrdu } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectBlog = (blogUrl) => {
    setUrl(blogUrl);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!url) return;

    setIsSubmitting(true);
    setResult(null);
    setError(null);

   try {
  const content = await scrapeBlogText(url);
  const summary = generateSummary(content);
  const urdu = translateToUrdu(summary);

  setResult({ content, summary, urdu });

  // Save to Supabase
const { error } = await supabase.from("summaries").insert([
  { url, summary, urdu }
]);

if (error) {
  console.error("Supabase Insert Error:", error.message);
} else {
  console.log("Summary saved to Supabase!");
}


} catch (err) {
  setError(err.message || "Failed to process blog");
}

  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog Summarizer</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Select a blog:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BLOG_DATA.map(blog => (
            <BlogCard 
              key={blog.id}
              title={blog.title}
              url={blog.url}
              onSelect={handleSelectBlog}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter blog URL"
            className="flex-1 py-2 px-4"
          />
          <Button 
            onClick={handleSubmit}
            disabled={!url || isSubmitting}
            className="px-6"
          >
            {isSubmitting ? "Processing..." : "Summarize"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-2xl font-semibold mb-4">Original Content</h3>
            <p className="text-lg leading-relaxed">{result.content}</p>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Summary (English)</h3>
            <p className="text-base">{result.summary}</p>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Urdu Translation</h3>
            <p className="text-base text-right" dir="rtl">{result.urdu}</p>
          </div>
        </div>
      )}
    </main>
  );
}