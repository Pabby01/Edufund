import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #126DE2 0%, #0B448E 100%)',
          borderRadius: '36px',
          color: 'white',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: 72 }}>🎓</div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            marginTop: 4,
            letterSpacing: '-0.5px',
            display: 'flex',
          }}
        >
          Edu<span style={{ color: '#EDAD21' }}>Fund</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

