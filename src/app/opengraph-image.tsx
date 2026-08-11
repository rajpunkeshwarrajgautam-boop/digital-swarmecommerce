import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Digital Swarm — Digital Products & AI Workflow Assets';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050507',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '78px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(216,179,106,.18)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-190px',
            right: '-120px',
            width: '720px',
            height: '720px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,135,245,.20) 0%, rgba(155,135,245,.04) 42%, transparent 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-220px',
            left: '-120px',
            width: '720px',
            height: '720px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(216,179,106,.17) 0%, rgba(216,179,106,.03) 45%, transparent 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.045,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', zIndex: 1, maxWidth: '760px' }}>
          <div
            style={{
              display: 'flex',
              color: '#d8b36a',
              fontSize: '18px',
              letterSpacing: '0.30em',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            DIGITALSWARM.IN · DIGITAL COMMERCE
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '82px',
              fontWeight: 900,
              color: '#f7f4ee',
              lineHeight: 0.92,
              letterSpacing: '-0.045em',
              textTransform: 'uppercase',
            }}
          >
            <span>Digital</span>
            <span style={{ color: '#d8b36a' }}>Swarm</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '29px',
              color: 'rgba(247,244,238,.62)',
              fontWeight: 500,
              lineHeight: 1.25,
              maxWidth: '700px',
            }}
          >
            Digital products, AI workflow assets and software kits with clear scope and private post-payment delivery.
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            {['CLEAR SCOPE', 'INR CHECKOUT', 'PRIVATE DELIVERY'].map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '9px 18px',
                  border: '1px solid rgba(216,179,106,.28)',
                  color: '#e6c982',
                  fontSize: '12px',
                  fontWeight: 800,
                  background: 'rgba(216,179,106,.055)',
                  letterSpacing: '0.10em',
                  borderRadius: '999px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '210px',
            height: '210px',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '205px',
              height: '205px',
              borderRadius: '50%',
              border: '1px solid rgba(216,179,106,.28)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '145px',
              height: '145px',
              transform: 'rotate(45deg)',
              borderRadius: '26px',
              border: '1px solid rgba(155,135,245,.35)',
              background: 'linear-gradient(145deg, rgba(216,179,106,.12), rgba(155,135,245,.08))',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: '76px',
              height: '76px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              border: '1px solid rgba(216,179,106,.55)',
              background: '#0d0d12',
              color: '#d8b36a',
              fontSize: '34px',
              fontWeight: 900,
            }}
          >
            DS
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
