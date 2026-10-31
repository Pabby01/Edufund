import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduFund — Every semester funded, before the deadline',
    short_name: 'EduFund',
    description:
      'Empowering Nigerian university students with transparent collective education funding, Cowrywise locked vaults, and direct Remita bursary settlements.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F131A',
    theme_color: '#126DE2',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

