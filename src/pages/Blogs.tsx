// src/pages/Blogs.tsx
import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { BlogPost, getAIBlogs } from '../lib/blogsData';
import Navbar from '../components/Navbar';

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const latest = await getAIBlogs();
      setBlogs(latest);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Latest Legal Blogs (AI-Powered)</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available right now.</p>
        ) : (
          blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        )}
      </div>
    </>
  );
};

export default Blogs;
