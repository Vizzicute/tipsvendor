import React from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const SearchBlog = () => {
  return (
    <div className="relative min-w-fit hidden flex-1 md:flex items-center justify-center">
      <input
        type="text"
        placeholder="Search blog posts..."
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <Button variant="ghost" className="absolute right-0">
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SearchBlog;
