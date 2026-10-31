import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #126DE2 0%, #0B448E 100%)',
          borderRadius: '8px',
          color: '#EDAD21',
          fontSize: '18px',
          fontWeight: 900,
        }}
      >
        🎓
      </div>
    ),
    {
      ...size,
    }
  );
}

