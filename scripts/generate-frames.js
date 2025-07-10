const fs = require("fs");
const path = require("path");

// Create simple SVG frames for each team
const teams = [
  { id: "red-team", name: "Red Team", color: "#EF4444" },
  { id: "blue-team", name: "Blue Team", color: "#3B82F6" },
  { id: "green-team", name: "Green Team", color: "#10B981" },
  { id: "yellow-team", name: "Yellow Team", color: "#F59E0B" },
  { id: "purple-team", name: "Purple Team", color: "#8B5CF6" },
];

const frameSize = 512;
const borderWidth = 40;

teams.forEach((team) => {
  const svg = `<svg width="${frameSize}" height="${frameSize}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient-${
      team.id
    }" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${team.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${team.color}CC;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Outer border -->
  <rect width="${frameSize}" height="${frameSize}" fill="url(#gradient-${
    team.id
  })" />
  
  <!-- Inner transparent area -->
  <rect x="${borderWidth}" y="${borderWidth}" 
        width="${frameSize - borderWidth * 2}" 
        height="${frameSize - borderWidth * 2}" 
        fill="transparent" />
  
  <!-- Team name -->
  <text x="${frameSize / 2}" y="${frameSize - 10}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        font-weight="bold" 
        fill="white">${team.name}</text>
  
  <!-- Decorative elements -->
  <circle cx="${borderWidth / 2}" cy="${
    borderWidth / 2
  }" r="8" fill="white" opacity="0.8" />
  <circle cx="${frameSize - borderWidth / 2}" cy="${
    borderWidth / 2
  }" r="8" fill="white" opacity="0.8" />
  <circle cx="${borderWidth / 2}" cy="${
    frameSize - borderWidth / 2
  }" r="8" fill="white" opacity="0.8" />
  <circle cx="${frameSize - borderWidth / 2}" cy="${
    frameSize - borderWidth / 2
  }" r="8" fill="white" opacity="0.8" />
</svg>`;

  const outputPath = path.join(
    __dirname,
    "..",
    "public",
    "frames",
    `${team.id}.svg`
  );
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated frame: ${team.id}.svg`);
});

console.log("All frames generated successfully!");
