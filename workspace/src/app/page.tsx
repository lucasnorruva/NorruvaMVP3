
"use client"; 

import React from 'react';

export default function HomePage() {
  const timestamp = new Date().toISOString();

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#E0FFFF', border: '5px solid blue', minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '80px' }}>
      <h1 style={{ fontSize: '36px', color: 'blue', fontWeight: 'bold' }}>HOMEPAGE DEBUG - Version 2</h1>
      <p style={{ fontSize: '20px', marginTop: '20px' }}>
        This page was updated at:
      </p>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'green', marginTop: '10px' }}>
        {timestamp}
      </p>
      <p style={{ fontSize: '16px', marginTop: '30px' }}>
        If this new message and timestamp do NOT appear after a hard refresh (Ctrl+Shift+R or Cmd+Shift+R),
        the development server is NOT serving updated files.
      </p>
    </div>
  );
}
