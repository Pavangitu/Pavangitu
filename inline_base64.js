import fs from 'fs';
import path from 'path';

const luffyWalkPath = path.resolve(process.cwd(), 'luffy_walk.png');
const widgetPath = path.resolve(process.cwd(), 'luffy_widget.svg');
const publicWidgetPath = path.resolve(process.cwd(), 'public', 'luffy_widget.svg');

if (fs.existsSync(luffyWalkPath) && fs.existsSync(widgetPath)) {
  try {
    const base64 = fs.readFileSync(luffyWalkPath).toString('base64');
    
    // Process root file
    let svgContent = fs.readFileSync(widgetPath, 'utf8');
    svgContent = svgContent.replace(/<image\s+href="[^"]*"/, `<image href="data:image/png;base64,${base64}"`);
    fs.writeFileSync(widgetPath, svgContent);
    console.log('Successfully inlined base64 into luffy_widget.svg');

    // Process public file
    if (fs.existsSync(publicWidgetPath)) {
      let publicSvgContent = fs.readFileSync(publicWidgetPath, 'utf8');
      publicSvgContent = publicSvgContent.replace(/<image\s+href="[^"]*"/, `<image href="data:image/png;base64,${base64}"`);
      fs.writeFileSync(publicWidgetPath, publicSvgContent);
      console.log('Successfully inlined base64 into public/luffy_widget.svg');
    }
  } catch (e) {
    console.error('Failed to inline base64:', e);
  }
} else {
  console.log('Required files not found!');
}
