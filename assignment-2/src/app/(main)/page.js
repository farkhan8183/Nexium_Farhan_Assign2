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

      // Save full blog to MongoDB
      await fetch("/api/saveBlogContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, content }),
      });
    } catch (err) {
      setError(err.message || "Failed to process blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-600 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-300 rounded-3xl shadow-xl p-10 space-y-10">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700">
          AI Blog Summarizer
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Choose a blog:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {BLOG_DATA.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                url={blog.url}
                onSelect={handleSelectBlog}
              />
            ))}
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-medium text-gray-600 mb-4">Or paste your blog URL:</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-blog"
              className="flex-1 py-2 px-4 rounded-lg"
            />
            <Button
              onClick={handleSubmit}
              disabled={!url || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2"
            >
              {isSubmitting ? "Summarizing..." : "Summarize"}
            </Button>
          </div>
        </section>

        {result && (
          <section className="space-y-8">
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">📜 Original Blog Content</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.content}</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-700 mb-2">🔍 Summary (English)</h3>
              <p className="text-gray-800">{result.summary}</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow text-right">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2 text-right">📖 اردو ترجمہ</h3>
              <p className="text-gray-900 text-lg" dir="rtl">{result.urdu}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}