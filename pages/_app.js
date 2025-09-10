import React from 'react';
import '../src/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <Component {...pageProps} />
    </div>
  );
} 