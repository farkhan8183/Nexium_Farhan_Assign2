"use client";

import { BLOG_DATA } from "@/lib/constants";
import { BlogCard } from "./components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { scrapeBlogText, generateSummary, translateToUrdu } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Home() {
  //i  ve added states to keep track of input, results, loading etc...
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // show saved msg after save
  const [recent, setRecent] = useState([]); // last 3 saved summaries

  const handleSelectBlog = (blogUrl) => {
    // when user clicks on blog card
    setUrl(blogUrl);
    setError(null);
  };

  useEffect(() => {
    // fettch recent summaries from supabase on load
    supabase
      .from("summaries")
      .select("url, summary")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setRecent(data);
      });
  }, []);

  const handleSubmit = async () => {
    if (!url) return;

    // basic url validation..
    if (!url.startsWith("http")) {
      setError("url must start with http or https");
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    setError(null);
    setIsSaved(false);

    try {
      // 1. scrape blog contnt
      const content = await scrapeBlogText(url);

      // 2. create summary using static logic
      const summary = generateSummary(content);

      // 3. convert summary to urdu (simple dictionary)
      const urdu = translateToUrdu(summary);

      setResult({ content, summary, urdu, domain: new URL(url).hostname });

      // 4. save to supabase
      const { error: supabaseError } = await supabase.from("summaries").insert([
        { url, summary, urdu }
      ]);

      if (supabaseError) {
        console.error("Supabase Insert Error:", supabaseError.message);
      }

      // 5. save full blog text to mongo (via api route)
      await fetch("/api/saveBlogContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, content }),
      });

      setIsSaved(true); // show msg that data saved

      // refresh recent summaries
      const { data } = await supabase
        .from("summaries")
        .select("url, summary")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setRecent(data);

    } catch (err) {
      setError(err.message || "Failed to process blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-gray-950 via-black to-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-100 via-gry-300 to-gray-500 rounded-3xl shadow-xl p-6 sm:p-10 space-y-10">
        <h1 className="text-4xl font-extrabold text-center text-indigo-950">
          AI Blog Summarizer
        </h1>

        {/* show error msg if soomething goes wrong */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        {/* show success msg only when data is saved */}
        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
            Data saved to Supabase & MongoDB!
          </div>
        )}

        {/* loading indicator */}
        {isSubmitting && (
          <div className="text-center text-gray-800">⏳ summarizing blog...</div>
        )}

        {/* select blog from list */}
        <section>
          <h2 className="text-2xl text-center mb-4  font-bold text-gray-950">Choose a blog:</h2>
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

        {/* manual input section */}
        <section className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-medium text-gray-600 mb-4">
            Select any URL from above:
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-blog"
              className="flex-1 py-2 px-4 rounded-lg"
            />
            <Button
              onClick={handleSubmit}
              disabled={!url || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 w-full sm:w-auto"
            >
              {isSubmitting ? "Summarizing..." : "Summarize"}
            </Button>
          </div>
        </section>

        {/* show results if available */}
        {result && (
          <section className="space-y-8">

            {/* tell user where data is saved */}
            <div className="bg-white border border-indigo-300 p-4 rounded-lg shadow-sm text-sm text-gray-600 flex justify-between">
              <div><span className="font-semibold text-indigo-900">Summary:</span> Saved to Supabase 🟣</div>
              <div><span className="font-semibold text-indigo-900">Full Content:</span> Saved to MongoDB 🟢</div>
            </div>

            {/* show domain */}
            <div className="text-sm text-gray-500 italic text-center">
              Source: {result.domain}
            </div>

            {/* full blog content */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-indigo-950 underline mb-2">Original Blog Content:</h3>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{result.content}</p>
            </div>

            {/* summary in english */}
            <div className="bg-green-50 border-l-4 border-green-900 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Summary (English)</h3>
              <p className="text-gray-800">{result.summary}</p>
            </div>

            {/* urdu translated */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow text-right">
              <h3 className="text-xl font-semibold text-yellow-700 mb-2 text-right">📖 اردو ترجمہ</h3>
              <p className="text-gray-900 text-lg" dir="rtl">{result.urdu}</p>
            </div>
          </section>
        )}

        {/* show recent sumaries */}
        {recent.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Latest Saved Summaries</h2>
            <ul className="space-y-3">
              {recent.map((r, i) => (
                <li key={i} className="bg-white p-3 rounded shadow text-sm">
                  <strong>{new URL(r.url).hostname}</strong>: {r.summary}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
