// CYBERPUNK MINI UI KIT — DIGITAL SWARM [v1.0]
// Basic React implementation for dystopian-style interfaces

import React from 'react';

/**
 * ⚡ CyberButton Component
 * Features a sharp industrial design with neo-glow hover states.
 */
export const CyberButton = ({ children, onClick, active = false }: { children: React.ReactNode; onClick?: () => void; active?: boolean }) => (
  <button 
    onClick={onClick}
    style={{
      background: active ? 'hsl(45, 100%, 50%)' : 'transparent',
      color: active ? 'black' : 'white',
      border: '2px solid hsl(0, 0%, 100%)',
      padding: '12px 24px',
      textTransform: 'uppercase',
      fontWeight: '900',
      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      transition: 'all 200ms ease',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

/**
 * 🔍 CyberInput Component
 * Minimalistic industrial text field with sharp edges.
 */
export const CyberInput = ({ placeholder, type = "text" }: { placeholder?: string; type?: string }) => (
  <input 
    type={type}
    placeholder={placeholder}
    style={{
      backgroundColor: 'hsl(0, 0%, 5%)',
      border: '1px solid hsl(0, 0%, 20%)',
      color: 'white',
      padding: '16px',
      width: '100%',
      fontFamily: 'monospace',
      outline: 'none',
      transition: 'border-color 300ms ease'
    }}
  />
);

/**
 * 🕋 CyberCard Component
 * Brutalist container for industrial information display.
 */
export const CyberCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{
    backgroundColor: 'hsl(0, 0%, 2%)',
    border: '1px solid hsl(0, 0%, 10%)',
    padding: '30px',
    boxShadow: '20px 20px 0px hsla(0, 0%, 0%, 0.5)'
  }}>
    <h3 style={{
        textTransform: 'uppercase', 
        fontSize: '10px', 
        letterSpacing: '5px',
        color: 'hsla(0, 0%, 100%, 0.2)',
        marginBottom: '20px'
    }}>
      {title}
    </h3>
    <div style={{ color: 'white' }}>
      {children}
    </div>
  </div>
);
