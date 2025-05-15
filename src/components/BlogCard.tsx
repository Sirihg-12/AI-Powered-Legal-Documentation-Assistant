// src/components/BlogCard.tsx
import React from 'react';
import { BlogPost } from '../lib/blogsData';

interface Props {
  blog: BlogPost;
}

const BlogCard: React.FC<Props> = ({ blog }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6 border border-gray-200">
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
        <p className="text-sm text-gray-600 mb-1">By {blog.author} | {blog.date}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <p className="text-gray-700 mb-3">{blog.summary}</p>
        <a
          href={blog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium hover:underline"
        >
          Read more →
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
