import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BLOG_DATA, ENGLISH_TO_URDU } from "./constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const scrapeBlogText = async (url) => {
  const blog = BLOG_DATA.find(b => b.url === url);
  if (!blog) throw new Error("Blog not found");
  return blog.content; // Return full content now
};

export const generateSummary = (text) => {
  const blog = BLOG_DATA.find(b => b.content === text);
  return blog ? blog.summary : "Summary not available";
};

export const translateToUrdu = (text) => {
  return text
    .split(" ")
    .map(word => ENGLISH_TO_URDU[word.toLowerCase()] || word)
    .join(" ");
};