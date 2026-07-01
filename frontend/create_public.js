const fs = require("fs");
const path = require("path");

const files = {
  "public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0f1e" />
    <meta name="description" content="WasteBridge - Connecting waste collectors with recycling industries" />
    <title>WasteBridge ♻️</title>
    <style>
      body { margin: 0; background: #0a0f1e; }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,

  "public/manifest.json": `{
  "short_name": "WasteBridge",
  "name": "WasteBridge - Waste Marketplace",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0a0f1e",
  "background_color": "#0a0f1e"
}`,

  "public/robots.txt": `User-agent: *
Disallow:`
};

Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Created:", filePath);
});


