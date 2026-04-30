const fs = require('fs');
const path = require('path');

const dir = 'build_epub';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. 修正圖片路徑
  content = content.replace(/\.\.\/images\//g, 'images/');
  
  // 2. 移除所有 Emoji 符號 (Kimoji)
  // 使用廣泛的 Unicode 匹配來移除表情符號
  content = content.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // 3. 移除手動導覽文字與連結 (包含箭頭、分隔符、整行導覽)
  // 匹配包含「下一章」、「上一章」、「查看答案」、「回目錄」且含有 .md 連結的整行
  // 同時處理箭頭 ← → 與全形分隔符 ｜
  content = content.replace(/^.*([←→]|下一章|上一章|查看答案|回目錄).*?\(.*?\.md.*?\).*$/gm, '');
  
  // 4. 清理殘留的孤立連結或關鍵字 (萬一沒被整行匹配到)
  content = content.replace(/\[.*?查看答案.*?\]\(.*?\.md.*?\)/g, '');
  content = content.replace(/\*\*\[(下一章|上一章|回目錄).*?\]\(.*?\.md\)\*\*/g, '');
  
  // 5. 將其餘所有指向 .md 檔案的連結轉換為純文字
  content = content.replace(/\[(.*?)\]\(.*?\/?.*?\.md.*?\)/g, '$1');
  
  // 6. 移除 Markdown 中的自定義錨點 {#ch...}
  content = content.replace(/\{#ch\d+\}/g, '');

  // 確保 UTF-8 無 BOM 寫入
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Markdown content cleaned and prepared for EPUB.');
