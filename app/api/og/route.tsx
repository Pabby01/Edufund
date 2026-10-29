import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Support this Nigerian Student Goal';
    const school = searchParams.get('school') || 'University Education Goal';
    const target = searchParams.get('target') || '₦450,000';
    const percent = searchParams.get('percent') || '45%';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0f1d',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
            backgroundSize: '40px 40px',
            padding: '60px',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Brand Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#1d70b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '20px',
                }}
              >
                E
              </div>
              <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Edu<span style={{ color: '#f5a623' }}>Fund</span>
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(245, 166, 35, 0.15)',
                border: '1px solid rgba(245, 166, 35, 0.4)',
                color: '#f5a623',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Verified Student Campaign
            </div>
          </div>

          {/* Center Story */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '850px' }}>
            <span style={{ color: '#94a3b8', fontSize: '22px', fontWeight: 600 }}>
              {school}
            </span>
            <h1
              style={{
                fontSize: '52px',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                color: '#ffffff',
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Funding Bar & Target */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Target Goal</span>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#f5a623' }}>{target}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Funded So Far</span>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#34d399' }}>{percent}</span>
              </div>
            </div>

            <div style={{ fontSize: '16px', color: '#94a3b8' }}>
              edufund.ng · Cowrywise Innovation Challenge 2026
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}

