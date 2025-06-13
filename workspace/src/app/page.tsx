
"use client";
import React from 'react';

export default function HomePage() {
  const timestamp = new Date().toISOString();
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 70px)', // Adjust for root layout banner
      marginTop: '70px', // Adjust for root layout banner
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#D1FAE5', /* Light Green */
      border: '10px solid #065F46' /* Dark Green border */
    }}>
      <div style={{ 
        padding: '40px', 
        border: '5px dashed #F87171', /* Red dashed border */
        backgroundColor: '#FEF3C7', /* Light Yellow background */
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '3.5rem', color: '#B91C1C', fontWeight: 'bold', marginBottom: '20px' }}>
          HOMEPAGE DEBUG - VERSION 3
        </h1>
        <p style={{ fontSize: '1.8rem', marginTop: '20px', color: '#1E40AF' /* Dark Blue */ }}>
          If you are seeing this, then 'workspace/src/app/page.tsx' IS updating.
        </p>
        <p style={{ fontSize: '1.5rem', marginTop: '15px', color: '#7C3AED' /* Purple */ }}>
          Timestamp: {timestamp}
        </p>
        <p style={{ marginTop: '40px', fontSize: '1.2rem', color: '#4A5568' /* Gray */ }}>
          (This is a forced minimal page. No role selector, no original content.)
        </p>
      </div>
    </div>
  );
}
