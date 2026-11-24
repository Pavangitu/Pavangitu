import fs from 'fs';
import path from 'path';

function processWidget(baseDir) {
  const luffyWalkPath = path.resolve(baseDir, 'luffy_walk.png');
  const widgetPath = path.resolve(baseDir, 'luffy_widget.svg');
  const publicWidgetPath = path.resolve(baseDir, 'public', 'luffy_widget.svg');

  if (fs.existsSync(luffyWalkPath) && fs.existsSync(widgetPath)) {
    try {
      const base64 = fs.readFileSync(luffyWalkPath).toString('base64');
      
      // Process root file
      let svgContent = fs.readFileSync(widgetPath, 'utf8');
      svgContent = svgContent.replace(/<image\b([^>]*?)\b(?:xlink:)?href="[^"]*"([^>]*?)>/g, `<image$1href="data:image/png;base64,${base64}"$2>`);
      fs.writeFileSync(widgetPath, svgContent);
      console.log(`[${baseDir}] Successfully inlined base64 into luffy_widget.svg`);

      // Process public file if present
      if (fs.existsSync(publicWidgetPath)) {
        let publicSvgContent = fs.readFileSync(publicWidgetPath, 'utf8');
        publicSvgContent = publicSvgContent.replace(/<image\b([^>]*?)\b(?:xlink:)?href="[^"]*"([^>]*?)>/g, `<image$1href="data:image/png;base64,${base64}"$2>`);
        fs.writeFileSync(publicWidgetPath, publicSvgContent);
        console.log(`[${baseDir}] Successfully inlined base64 into public/luffy_widget.svg`);
      }
      return true;
    } catch (e) {
      console.error(`[${baseDir}] Failed to inline base64:`, e);
      return false;
    }
  } else {
    console.log(`[${baseDir}] Required files (luffy_walk.png or luffy_widget.svg) not found!`);
    return false;
  }
}

// Run for current directory and all sub-targets
const targets = [process.cwd(), path.resolve(process.cwd(), 'temp-remote'), path.resolve(process.cwd(), 'pavan-main')];
for (const t of targets) {
  if (fs.existsSync(t)) {
    processWidget(t);
  }
}
