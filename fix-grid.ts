import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/pages/Home.tsx',
  'src/pages/CategoryDetail.tsx',
  'src/pages/Favorites.tsx',
  'src/pages/History.tsx',
  'src/pages/FlashSale.tsx',
  'src/pages/OrderList.tsx',
  'src/pages/MerchantDashboard.tsx'
];

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove gradient overlay
  content = content.replace(/<div className="absolute inset-0 bg-gradient-to-t from-charcoal\/80 to-transparent"><\/div>\n\s*/g, '');
  
  // Remove negative margins
  content = content.replace(/className="p-3 relative z-10 -mt-8"/g, 'className="p-3 relative z-10"');
  content = content.replace(/className="p-3 relative z-10 -mt-6"/g, 'className="p-3 relative z-10"');
  content = content.replace(/className="p-2 relative z-10 -mt-6"/g, 'className="p-2 relative z-10"');
  content = content.replace(/className="p-2 relative z-10 -mt-8"/g, 'className="p-2 relative z-10"');
  
  // Change line-clamp-2 to truncate and remove h-10/h-8
  content = content.replace(/line-clamp-2 leading-tight mb-3 h-10/g, 'truncate mb-2');
  content = content.replace(/line-clamp-2 leading-tight mb-2 h-10/g, 'truncate mb-2');
  content = content.replace(/line-clamp-2 leading-snug mb-2 h-10/g, 'truncate mb-2');
  content = content.replace(/line-clamp-2 leading-snug h-10/g, 'truncate');
  content = content.replace(/line-clamp-2 leading-snug/g, 'truncate');
  content = content.replace(/line-clamp-2 mb-1/g, 'truncate mb-1');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${file}`);
}
