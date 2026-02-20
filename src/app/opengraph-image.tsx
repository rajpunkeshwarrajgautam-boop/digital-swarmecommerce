import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Digital Swarm — Premium Digital Products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }} />

        {/* Left: Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 1 }}>
          <div style={{
            fontSize: '18px',
            color: '#3b82f6',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            digitalswarm.in
          </div>
          <div style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            maxWidth: '640px',
          }}>
            Digital Swarm
          </div>
          <div style={{
            fontSize: '28px',
            color: '#94a3b8',
            fontWeight: 400,
          }}>
            Premium Digital Products
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
          }}>
            {['Web Bundles', 'Templates', 'Assets'].map((tag) => (
              <div key={tag} style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid rgba(59,130,246,0.4)',
                color: '#3b82f6',
                fontSize: '16px',
                background: 'rgba(59,130,246,0.08)',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Abstract particle dot grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '260px', gap: '12px', zIndex: 1, opacity: 0.6 }}>
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: i % 3 === 0
                ? 'rgba(59,130,246,0.9)'
                : i % 7 === 0
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(59,130,246,0.2)',
              boxShadow: i % 3 === 0 ? '0 0 10px rgba(59,130,246,0.8)' : 'none',
            }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
