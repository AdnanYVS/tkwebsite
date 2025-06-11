import React, { useState } from "react";
import { Search } from "lucide-react";

const BlogSearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto my-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Blog yazılarında ara..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
      />
    </form>
  );
};

export default BlogSearchBar;
