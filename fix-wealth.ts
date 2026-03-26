import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/pages/Wealth.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Remove SCNY transfer button
content = content.replace(/<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+setTransferAsset\('SCNY'\);\s+setActiveModal\('transfer'\);\s+\}\}\s+className="bg-cyan\/20 text-cyan border border-cyan\/30 px-3 py-1 rounded-full text-xs font-bold active:scale-95 transition-transform hover:bg-cyan\/30"\s+>\s+转账\s+<\/button>/g, '');

// Remove SXT transfer button
content = content.replace(/<button\s+onClick=\{\(e\) => \{\s+e\.stopPropagation\(\);\s+setTransferAsset\('SXT'\);\s+setActiveModal\('transfer'\);\s+\}\}\s+className="bg-cyan\/20 text-cyan border border-cyan\/30 px-3 py-1 rounded-full text-xs font-bold active:scale-95 transition-transform hover:bg-cyan\/30"\s+>\s+转账\s+<\/button>/g, '');

// Fix Hashrate Order layout
const oldLayout = `<div className="flex justify-between items-start mb-3">
                        <div>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md mr-2 border", order.type === '100percent' ? "bg-cyan/10 text-cyan border-cyan/30" : "bg-royal text-gray-800  border-glass-border")}>
                            {order.type === '100percent' ? '100%购物券' : '线性购物券'}
                          </span>
                          <span className="font-bold text-gray-900 text-sm font-mono">
                            {order.tier.toLocaleString()} × {order.count} = {(order.tier * order.count).toLocaleString()} SCNY
                          </span>
                        </div>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md border", order.status === 'active' ? "text-neon bg-neon/10 border-neon/30 shadow-neon" : "text-gray-800  bg-royal border-glass-border")}>
                          {order.status === 'active' ? '释放中' : '已完成'}
                        </span>
                      </div>`;

const newLayout = `<div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.type === '100percent' ? "bg-cyan/10 text-cyan border-cyan/30" : "bg-royal text-gray-800 border-glass-border")}>
                              {order.type === '100percent' ? '100%购物券' : '线性购物券'}
                            </span>
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap", order.status === 'active' ? "text-neon bg-neon/10 border-neon/30 shadow-neon" : "text-gray-800 bg-royal border-glass-border")}>
                              {order.status === 'active' ? '释放中' : '已完成'}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900 text-sm font-mono break-all leading-tight">
                            {order.tier.toLocaleString()} × {order.count} = {(order.tier * order.count).toLocaleString()} SCNY
                          </span>
                        </div>
                      </div>`;

content = content.replace(oldLayout, newLayout);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed Wealth.tsx');
