import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const titre = searchParams.get('titre') || 'Aide aux chefs d\'entreprise en difficulté';

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
          background: 'linear-gradient(135deg, #0A1628 0%, #1E3D82 100%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.08em',
            }}
          >
            AVELOR
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              background: '#4A72B8',
              margin: '24px 0',
            }}
          />
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            {titre}
          </div>
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 32,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
            }}
          >
            Gratuit · Confidentiel · Sans jugement
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
