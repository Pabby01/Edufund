import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edufund.app';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    '',
    '/about',
    '/tracks',
    '/tracks/tuition',
    '/tracks/hostels',
    '/tracks/stem',
    '/tracks/clearance',
    '/stacks',
    '/explore',
    '/squads',
    '/how-it-works',
    '/support',
    '/terms',
    '/privacy',
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/explore' || route === '/squads' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/tracks') || route === '/explore' ? 0.8 : 0.6,
  }));
}

