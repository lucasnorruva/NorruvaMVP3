
"use client"; // Still good practice for any client-side interaction, even if minimal

import React from 'react';

export default function HomePage() {
  const timestamp = new Date().toISOString();

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#FFFFE0', border: '5px solid red', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '48px', color: 'red', fontWeight: 'bold' }}>MINIMAL DEBUG PAGE</h1>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>
        If you see this message, src/app/page.tsx was updated at:
      </p>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue', marginTop: '10px' }}>
        {timestamp}
      </p>
      <p style={{ fontSize: '18px', marginTop: '30px' }}>
        If this timestamp does NOT change after you save and hard-refresh your browser (Ctrl+Shift+R or Cmd+Shift+R),
        then the development server or a caching layer is NOT reflecting file updates correctly.
      </p>
      <p style={{fontSize: '18px', marginTop: '10px'}}>
        The previous content of this page (role selector, etc.) has been temporarily removed for this test.
      </p>
    </div>
  );
}
