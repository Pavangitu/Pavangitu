import fs from 'fs';

const imgBuffer = fs.readFileSync('assets/pavan-profile.jpg');
const base64Img = imgBuffer.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="160" height="160" role="img" aria-label="Pavan Datta Gedila">
  <defs>
    <clipPath id="avatarCircle">
      <circle cx="100" cy="100" r="86"/>
    </clipPath>
    <filter id="avatarGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Crimson Glow Shadow -->
  <circle cx="100" cy="100" r="90" fill="none" stroke="#E8203A" stroke-width="4" opacity="0.55" filter="url(#avatarGlow)"/>

  <!-- Circular Profile Photo -->
  <image href="data:image/jpeg;base64,${base64Img}" x="14" y="14" width="172" height="172" clip-path="url(#avatarCircle)" preserveAspectRatio="xMidYMid slice"/>

  <!-- High-End Gold Bezel Border -->
  <circle cx="100" cy="100" r="86" fill="none" stroke="#B8893F" stroke-width="3.5"/>
  <circle cx="100" cy="100" r="89" fill="none" stroke="#E8203A" stroke-width="1.2" opacity="0.7"/>
</svg>`;

fs.writeFileSync('assets/pavan-avatar.svg', svg);
fs.writeFileSync('pavan-main/assets/pavan-avatar.svg', svg);
console.log('pavan-avatar.svg created successfully, size:', svg.length);
