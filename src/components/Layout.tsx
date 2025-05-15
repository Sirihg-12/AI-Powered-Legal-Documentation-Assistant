// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      {/* Global Navbar */}
      <Navbar />

      {/* This main wrapper has a background color, can style further */}
      <main className="bg-slate-300 min-h-screen p-4">
        {/* Outlet is where nested routes (Home, Services, etc.) get rendered */}
        <Outlet />
      </main>
    </>
  );
}
