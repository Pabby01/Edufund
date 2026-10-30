import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Support this Nigerian Student Goal';
    const school = searchParams.get('school') || 'Nigerian University Education Goal';
    const name = searchParams.get('name') || 'Verified Indigent Student';
    const target = searchParams.get('target') || '₦450,000';
    const raised = searchParams.get('raised') || '₦280,000';
    const percent = searchParams.get('percent') || '62%';
    const days = searchParams.get('days') || '12 days left';
    const category = searchParams.get('category') || 'Tuition & Academic Fees';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#070b14',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), linear-gradient(135deg, rgba(29, 112, 184, 0.15) 0%, rgba(245, 166, 35, 0.08) 100%)',
            backgroundSize: '40px 40px, 100% 100%',
            padding: '50px 60px',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top Header Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#1d70b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '22px',
                  boxShadow: '0 4px 15px rgba(29, 112, 184, 0.4)',
                }}
              >
                E
              </div>
              <span style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Edu<span style={{ color: '#f5a623' }}>Fund</span>
              </span>
              <span
                style={{
                  marginLeft: '8px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {category}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              <span>● DIRECT REMITA SETTLEMENT</span>
            </div>
          </div>

          {/* Center Story & Student Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '920px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#f5a623', fontSize: '20px', fontWeight: 800 }}>
                {name}
              </span>
              <span style={{ color: '#64748b', fontSize: '18px' }}>·</span>
              <span style={{ color: '#cbd5e1', fontSize: '20px', fontWeight: 600 }}>
                {school}
              </span>
            </div>

            <h1
              style={{
                fontSize: '48px',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                color: '#ffffff',
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Live Progress Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '24px 30px',
              gap: '16px',
            }}
          >
            {/* Numbers Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: '48px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Goal
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#f5a623' }}>{target}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Raised So Far
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#34d399' }}>{raised}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Funded
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>{percent}</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(245, 166, 35, 0.15)',
                  border: '1px solid rgba(245, 166, 35, 0.3)',
                  color: '#f5a623',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {days}
              </div>
            </div>

            {/* Progress Bar Visual */}
            <div
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: percent,
                  height: '100%',
                  background: 'linear-gradient(90deg, #1d70b8 0%, #34d399 100%)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
              <span>0% Platform Commission · Cowrywise Locked Vault</span>
              <span>edufund.ng</span>
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
