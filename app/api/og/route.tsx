import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Couleur d'accent par catégorie (cohérent avec la charte Avelor).
const ACCENTS: Record<string, string> = {
  outil: '#4A72B8',
  courrier: '#1E3D82',
  procedure: '#28A050',
  situation: '#C94040',
  aide: '#C97830',
  faq: '#4A72B8',
  defaut: '#4A72B8',
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const titre = searchParams.get('titre') || 'Aide aux chefs d\'entreprise en difficulté';
  const sous = searchParams.get('sous') || '';
  const cat = (searchParams.get('cat') || 'defaut').toLowerCase();
  const accent = ACCENTS[cat] ?? ACCENTS.defaut;

  // Adapte la taille du titre à sa longueur pour éviter les débordements.
  const titreSize = titre.length > 70 ? 44 : titre.length > 40 ? 56 : 66;

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
          position: 'relative',
        }}
      >
        {/* Bandeau d'accent supérieur */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: accent,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.18em',
            }}
          >
            AVELOR
          </div>
          <div
            style={{
              width: 70,
              height: 3,
              background: accent,
              margin: '28px 0',
            }}
          />
          <div
            style={{
              fontSize: titreSize,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {titre}
          </div>
          {sous ? (
            <div
              style={{
                fontSize: 28,
                color: 'rgba(255,255,255,0.72)',
                textAlign: 'center',
                marginTop: 24,
                lineHeight: 1.4,
              }}
            >
              {sous}
            </div>
          ) : null}
          <div
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 40,
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
