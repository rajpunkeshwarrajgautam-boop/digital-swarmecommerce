import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Digital Swarm — Elite AI Agent Store & SaaS Boilerplates';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#07070a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
          border: '20px solid #000',
        }}
      >
        {/* Background glow - Gold/Lime theme */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,255,0,0.15) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,255,0,0.05) 0%, transparent 70%)',
        }} />

        {/* Industrial grid effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Left: Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
          <div style={{
            fontSize: '20px',
            color: '#CCFF00',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            fontWeight: 800,
            fontStyle: 'italic',
          }}>
            digitalswarm.in // genesis_v1
          </div>
          <div style={{
            fontSize: '84px',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 0.9,
            maxWidth: '700px',
            textTransform: 'uppercase',
            fontStyle: 'italic',
          }}>
            Digital <br />
            <span style={{ color: '#CCFF00' }}>Swarm</span>
          </div>
          <div style={{
            fontSize: '32px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 500,
            maxWidth: '600px',
            lineHeight: 1.2,
          }}>
            Elite AI Agent Store & SaaS Boilerplates for Modern Engineers.
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px',
          }}>
            {['AI PROTOCOLS', 'SAAS KITS', 'ELITE ASSETS'].map((tag) => (
              <div key={tag} style={{
                padding: '10px 24px',
                border: '1px solid rgba(204,255,0,0.3)',
                color: '#CCFF00',
                fontSize: '14px',
                fontWeight: 800,
                background: 'rgba(204,255,0,0.05)',
                letterSpacing: '0.1em',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Brutalist decoration */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          zIndex: 1, 
          padding: '20px',
          borderLeft: '1px solid rgba(255,255,255,0.05)'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: i % 2 === 0 ? '40px' : '80px',
              height: '4px',
              background: i % 3 === 0 ? '#CCFF00' : 'rgba(255,255,255,0.1)',
            }} />
          ))}
          <div style={{ marginTop: '20px', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: 700, letterSpacing: '0.2em' }}>
            STATUS: ACTIVE <br />
            UPLINK: SECURE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
