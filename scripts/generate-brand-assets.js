const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const brandDir = path.join(__dirname, '../public/brand');
const artifactDir = '/Users/admin/.gemini/antigravity/brain/70cea7b4-f43d-4930-900e-38cc6a4dfa0d';

if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

// 1. Icon Only SVG (512x512)
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ef-grad-blue" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e6fd9" />
      <stop offset="1" stop-color="#0a4fa3" />
    </linearGradient>
    <linearGradient id="ef-grad-gold" x1="128" y1="76" x2="384" y2="435" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4c95d" />
      <stop offset="1" stop-color="#d4a017" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="512" height="512" rx="128" fill="url(#ef-grad-blue)" />
  <path
    d="M153.6 179.2C204.8 140.8 307.2 140.8 358.4 179.2"
    stroke="url(#ef-grad-gold)"
    stroke-width="32"
    stroke-linecap="round"
    fill="none"
  />
  <circle cx="256" cy="281.6" r="83.2" fill="url(#ef-grad-gold)" />
  <path
    d="M256 236.8V326.4M211.2 281.6H300.8"
    stroke="#0a4fa3"
    stroke-width="25.6"
    stroke-linecap="round"
  />
  <path
    d="M179.2 358.4C217.6 384 294.4 384 332.8 358.4"
    stroke="#ffffff"
    stroke-width="25.6"
    stroke-linecap="round"
    fill="none"
    opacity="0.85"
  />
</svg>`;

// 2. Horizontal Logo for Dark Backgrounds (Transparent PNG, 1400x360)
const horizontalDarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1400" height="360" viewBox="0 0 1400 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ef-grad-blue" x1="40" y1="40" x2="320" y2="320" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e6fd9" />
      <stop offset="1" stop-color="#0a4fa3" />
    </linearGradient>
    <linearGradient id="ef-grad-gold" x1="110" y1="80" x2="250" y2="280" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4c95d" />
      <stop offset="1" stop-color="#d4a017" />
    </linearGradient>
  </defs>
  
  <!-- Icon -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="280" height="280" rx="70" fill="url(#ef-grad-blue)" />
    <path
      d="M84 98C112 77 168 77 196 98"
      stroke="url(#ef-grad-gold)"
      stroke-width="17.5"
      stroke-linecap="round"
      fill="none"
    />
    <circle cx="140" cy="154" r="45.5" fill="url(#ef-grad-gold)" />
    <path
      d="M140 129.5V178.5M115.5 154H164.5"
      stroke="#0a4fa3"
      stroke-width="14"
      stroke-linecap="round"
    />
    <path
      d="M98 196C119 210 161 210 182 196"
      stroke="#ffffff"
      stroke-width="14"
      stroke-linecap="round"
      fill="none"
      opacity="0.85"
    />
  </g>

  <!-- Wordmark & Subtitles -->
  <text x="360" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Gabarito', 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="140" letter-spacing="-3">
    <tspan fill="#428DF0">Edu</tspan><tspan fill="#EDAD21">Fund</tspan>
  </text>
  
  <text x="366" y="255" font-family="-apple-system, BlinkMacSystemFont, 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="30" fill="#9DA3AF" letter-spacing="-0.5">
    Every semester funded, before the deadline.
  </text>
  
  <rect x="366" y="275" width="480" height="26" rx="13" fill="#126DE2" fill-opacity="0.2" stroke="#126DE2" stroke-opacity="0.5" />
  <text x="382" y="293" font-family="'Azeret Mono', Menlo, Consolas, monospace" font-weight="700" font-size="12" fill="#428DF0" letter-spacing="1">
    COWRYWISE AMBASSADORS INNOVATION 2026
  </text>
</svg>`;

// 3. Horizontal Logo for Light Backgrounds (Transparent PNG, 1400x360)
const horizontalLightSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1400" height="360" viewBox="0 0 1400 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ef-grad-blue-l" x1="40" y1="40" x2="320" y2="320" gradientUnits="userSpaceOnUse">
      <stop stop-color="#126de2" />
      <stop offset="1" stop-color="#0b448e" />
    </linearGradient>
    <linearGradient id="ef-grad-gold-l" x1="110" y1="80" x2="250" y2="280" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f4c95d" />
      <stop offset="1" stop-color="#d4a017" />
    </linearGradient>
  </defs>
  
  <!-- Icon -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="280" height="280" rx="70" fill="url(#ef-grad-blue-l)" />
    <path
      d="M84 98C112 77 168 77 196 98"
      stroke="url(#ef-grad-gold-l)"
      stroke-width="17.5"
      stroke-linecap="round"
      fill="none"
    />
    <circle cx="140" cy="154" r="45.5" fill="url(#ef-grad-gold-l)" />
    <path
      d="M140 129.5V178.5M115.5 154H164.5"
      stroke="#0b448e"
      stroke-width="14"
      stroke-linecap="round"
    />
    <path
      d="M98 196C119 210 161 210 182 196"
      stroke="#ffffff"
      stroke-width="14"
      stroke-linecap="round"
      fill="none"
      opacity="0.85"
    />
  </g>

  <!-- Wordmark & Subtitles -->
  <text x="360" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Gabarito', 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="140" letter-spacing="-3">
    <tspan fill="#126DE2">Edu</tspan><tspan fill="#EDAD21">Fund</tspan>
  </text>
  
  <text x="366" y="255" font-family="-apple-system, BlinkMacSystemFont, 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="30" fill="#4B5563" letter-spacing="-0.5">
    Every semester funded, before the deadline.
  </text>
  
  <rect x="366" y="275" width="480" height="26" rx="13" fill="#0B448E" fill-opacity="0.08" stroke="#0B448E" stroke-opacity="0.3" />
  <text x="382" y="293" font-family="'Azeret Mono', Menlo, Consolas, monospace" font-weight="700" font-size="12" fill="#0B448E" letter-spacing="1">
    COWRYWISE AMBASSADORS INNOVATION 2026
  </text>
</svg>`;

// 4. Full Pitch Deck Slide Card Dark (1920x1080)
const pitchDeckDarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ef-bg-dark" x1="0" y1="0" x2="1920" y2="1080" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F131A" />
      <stop offset="1" stop-color="#181C25" />
    </linearGradient>
    <radialGradient id="ef-glow-blue" cx="0.2" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#126DE2" stop-opacity="0.25" />
      <stop offset="1" stop-color="#126DE2" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ef-glow-gold" cx="0.8" cy="0.7" r="0.7">
      <stop offset="0" stop-color="#EDAD21" stop-opacity="0.15" />
      <stop offset="1" stop-color="#EDAD21" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ef-grad-blue-p" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1E6FD9" />
      <stop offset="1" stop-color="#0A4FA3" />
    </linearGradient>
    <linearGradient id="ef-grad-gold-p" x1="90" y1="54" x2="270" y2="306" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F4C95D" />
      <stop offset="1" stop-color="#D4A017" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#ef-bg-dark)" />
  <rect width="1920" height="1080" fill="url(#ef-glow-blue)" />
  <rect width="1920" height="1080" fill="url(#ef-glow-gold)" />

  <!-- Center Card Frame -->
  <g transform="translate(420, 260)">
    <!-- Icon -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="220" height="220" rx="55" fill="url(#ef-grad-blue-p)" />
      <path
        d="M66 77C88 60 132 60 154 77"
        stroke="url(#ef-grad-gold-p)"
        stroke-width="13.75"
        stroke-linecap="round"
        fill="none"
      />
      <circle cx="110" cy="121" r="35.75" fill="url(#ef-grad-gold-p)" />
      <path
        d="M110 101.75V140.25M90.75 121H129.25"
        stroke="#0A4FA3"
        stroke-width="11"
        stroke-linecap="round"
      />
      <path
        d="M77 154C93.5 165 126.5 165 143 154"
        stroke="#ffffff"
        stroke-width="11"
        stroke-linecap="round"
        fill="none"
        opacity="0.85"
      />
    </g>

    <!-- Brand Typography -->
    <text x="270" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Gabarito', 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="140" letter-spacing="-3">
      <tspan fill="#428DF0">Edu</tspan><tspan fill="#EDAD21">Fund</tspan>
    </text>

    <text x="275" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="32" fill="#E2E8F0" letter-spacing="-0.5">
      Every semester funded, before the deadline.
    </text>

    <!-- Badges Row -->
    <g transform="translate(0, 280)">
      <rect x="0" y="0" width="280" height="48" rx="24" fill="#126DE2" fill-opacity="0.18" stroke="#126DE2" stroke-opacity="0.6" />
      <text x="26" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#428DF0" letter-spacing="1.2">
        🏛️ REMITA TSA BURSARY
      </text>

      <rect x="300" y="0" width="310" height="48" rx="24" fill="#EDAD21" fill-opacity="0.18" stroke="#EDAD21" stroke-opacity="0.6" />
      <text x="324" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#F4C95D" letter-spacing="1.2">
        💼 COWRYWISE VAULT (+8.5%)
      </text>

      <rect x="630" y="0" width="240" height="48" rx="24" fill="#10B981" fill-opacity="0.18" stroke="#10B981" stroke-opacity="0.6" />
      <text x="654" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#34D399" letter-spacing="1.2">
        👥 ALUMNI SQUADS
      </text>
    </g>
  </g>
</svg>`;

// 5. Full Pitch Deck Slide Card Light (1920x1080)
const pitchDeckLightSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ef-bg-light" x1="0" y1="0" x2="1920" y2="1080" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC" />
      <stop offset="1" stop-color="#EEF2F6" />
    </linearGradient>
    <radialGradient id="ef-glow-blue-l" cx="0.2" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#126DE2" stop-opacity="0.12" />
      <stop offset="1" stop-color="#126DE2" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="ef-glow-gold-l" cx="0.8" cy="0.7" r="0.7">
      <stop offset="0" stop-color="#EDAD21" stop-opacity="0.10" />
      <stop offset="1" stop-color="#EDAD21" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="ef-grad-blue-pl" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#126DE2" />
      <stop offset="1" stop-color="#0B448E" />
    </linearGradient>
    <linearGradient id="ef-grad-gold-pl" x1="90" y1="54" x2="270" y2="306" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F4C95D" />
      <stop offset="1" stop-color="#D4A017" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#ef-bg-light)" />
  <rect width="1920" height="1080" fill="url(#ef-glow-blue-l)" />
  <rect width="1920" height="1080" fill="url(#ef-glow-gold-l)" />

  <!-- Center Card Frame -->
  <g transform="translate(420, 260)">
    <!-- Icon -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="220" height="220" rx="55" fill="url(#ef-grad-blue-pl)" />
      <path
        d="M66 77C88 60 132 60 154 77"
        stroke="url(#ef-grad-gold-pl)"
        stroke-width="13.75"
        stroke-linecap="round"
        fill="none"
      />
      <circle cx="110" cy="121" r="35.75" fill="url(#ef-grad-gold-pl)" />
      <path
        d="M110 101.75V140.25M90.75 121H129.25"
        stroke="#0B448E"
        stroke-width="11"
        stroke-linecap="round"
      />
      <path
        d="M77 154C93.5 165 126.5 165 143 154"
        stroke="#ffffff"
        stroke-width="11"
        stroke-linecap="round"
        fill="none"
        opacity="0.85"
      />
    </g>

    <!-- Brand Typography -->
    <text x="270" y="130" font-family="-apple-system, BlinkMacSystemFont, 'Gabarito', 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="140" letter-spacing="-3">
      <tspan fill="#126DE2">Edu</tspan><tspan fill="#EDAD21">Fund</tspan>
    </text>

    <text x="275" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Manrope', 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="32" fill="#1F2937" letter-spacing="-0.5">
      Every semester funded, before the deadline.
    </text>

    <!-- Badges Row -->
    <g transform="translate(0, 280)">
      <rect x="0" y="0" width="280" height="48" rx="24" fill="#126DE2" fill-opacity="0.10" stroke="#126DE2" stroke-opacity="0.4" />
      <text x="26" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#0B448E" letter-spacing="1.2">
        🏛️ REMITA TSA BURSARY
      </text>

      <rect x="300" y="0" width="310" height="48" rx="24" fill="#EDAD21" fill-opacity="0.15" stroke="#EDAD21" stroke-opacity="0.5" />
      <text x="324" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#B88414" letter-spacing="1.2">
        💼 COWRYWISE VAULT (+8.5%)
      </text>

      <rect x="630" y="0" width="240" height="48" rx="24" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-opacity="0.4" />
      <text x="654" y="30" font-family="'Azeret Mono', monospace" font-weight="700" font-size="13" fill="#047857" letter-spacing="1.2">
        👥 ALUMNI SQUADS
      </text>
    </g>
  </g>
</svg>`;

// Write SVGs
const files = [
  { name: 'edufund-icon-512', svg: iconSvg },
  { name: 'edufund-logo-horizontal-dark', svg: horizontalDarkSvg },
  { name: 'edufund-logo-horizontal-light', svg: horizontalLightSvg },
  { name: 'edufund-logo-pitch-dark', svg: pitchDeckDarkSvg },
  { name: 'edufund-logo-pitch-light', svg: pitchDeckLightSvg },
];

for (const { name, svg } of files) {
  const svgPath = path.join(brandDir, `${name}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log(`Wrote ${svgPath}`);

  // Convert to PNG
  const pngPath = path.join(brandDir, `${name}.png`);
  try {
    execSync(`sips -s format png "${svgPath}" --out "${pngPath}"`, { stdio: 'pipe' });
    console.log(`Generated PNG: ${pngPath}`);
  } catch (e) {
    console.error(`Failed to convert ${svgPath} to PNG:`, e.message);
  }

  // Convert Pitch cards to JPG as well
  if (name.includes('pitch')) {
    const jpgPath = path.join(brandDir, `${name}.jpg`);
    try {
      execSync(`sips -s format jpeg "${svgPath}" --out "${jpgPath}"`, { stdio: 'pipe' });
      console.log(`Generated JPG: ${jpgPath}`);
    } catch (e) {
      console.error(`Failed to convert ${svgPath} to JPG:`, e.message);
    }
  }
}

// Generate 1024x1024 App Store / High-Res Icon
const icon1024Png = path.join(brandDir, 'edufund-icon-1024.png');
try {
  execSync(`sips -s format png -z 1024 1024 "${path.join(brandDir, 'edufund-icon-512.svg')}" --out "${icon1024Png}"`, { stdio: 'pipe' });
  console.log(`Generated 1024x1024 icon: ${icon1024Png}`);
} catch (e) {
  console.error('Failed to generate 1024 icon:', e.message);
}

// Copy all generated files to Artifact directory for direct download & preview
if (fs.existsSync(artifactDir)) {
  const generatedFiles = fs.readdirSync(brandDir);
  for (const f of generatedFiles) {
    fs.copyFileSync(path.join(brandDir, f), path.join(artifactDir, f));
  }
  console.log(`Copied ${generatedFiles.length} files to artifact directory: ${artifactDir}`);
}

console.log('All brand assets generated successfully!');

