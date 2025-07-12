"use client";

import { Button } from "@/components/ui/button";

export function BlogCard({ title, url, onSelect }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 truncate">{url}</p>
      <Button 
        onClick={() => onSelect(url)}
        className="w-full"
      >
        Select
      </Button>
    </div>
  );
}