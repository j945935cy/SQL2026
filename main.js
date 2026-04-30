import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'sql';
      return hljs.highlight(code, { language }).value;
    }
  })
);

// Add custom renderer to fix image paths
marked.use({
  renderer: {
    image(href, title, text) {
      const fixedHref = href.replace('../images/', 'images/');
      return `<img src="${fixedHref}" alt="${text || ''}" title="${title || ''}" style="max-width:100%; border-radius:12px; margin: 1rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">`;
    }
  }
});

const chapters = [
  { id: '01', title: '第 01 章：資料庫簡介', path: 'chapters/01-資料庫簡介.md' },
  { id: '02', title: '第 02 章：基本查詢 SELECT', path: 'chapters/02-基本查詢SELECT.md' },
  { id: '03', title: '第 03 章：條件篩選 WHERE', path: 'chapters/03-條件篩選WHERE.md' },
  { id: '04', title: '第 04 章：排序與限制', path: 'chapters/04-排序與限制.md' },
  { id: '05', title: '第 05 章：聚合函數與分組', path: 'chapters/05-聚合函數與分組.md' },
  { id: '06', title: '第 06 章：多表關聯 JOIN', path: 'chapters/06-多表關聯JOIN.md' },
  { id: '07', title: '第 07 章：子查詢', path: 'chapters/07-子查詢.md' },
  { id: '08', title: '第 08 章：新增修改刪除', path: 'chapters/08-新增修改刪除.md' },
  { id: '09', title: '第 09 章：建立與管理表格', path: 'chapters/09-建立與管理表格.md' },
];

let currentChapterIndex = 0;

const chapterListEl = document.getElementById('chapter-list');
const markdownContentEl = document.getElementById('markdown-content');
const currentTitleEl = document.getElementById('current-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Initialize Navigation
function initNav() {
  chapters.forEach((chapter, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${chapter.id}`;
    a.textContent = chapter.title;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadContent(index);
      if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });
    li.appendChild(a);
    chapterListEl.appendChild(li);
  });

  // Handle Resource Links
  document.querySelectorAll('#resource-list a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-path');
      fetchAndRender(path, link.textContent);
      document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });
  });

  // Handle Internal Links within Markdown
  markdownContentEl.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.endsWith('.md')) {
        e.preventDefault();
        // Try to find if it's a chapter
        const filename = decodeURIComponent(href.split('/').pop());
        const index = chapters.findIndex(ch => {
          const chFilename = ch.path.split('/').pop();
          return chFilename === filename;
        });
        
        if (index !== -1) {
          loadContent(index);
        } else {
          // If it's a resource like cheatsheet.md
          const resourcePath = href.includes('exercises') ? `exercises/${filename}` : filename;
          fetchAndRender(resourcePath, link.textContent);
        }
      }
    }
  });
}

async function loadContent(index) {
  if (index < 0 || index >= chapters.length) return;
  
  currentChapterIndex = index;
  const chapter = chapters[index];
  
  // Update UI
  document.querySelectorAll('#chapter-list a').forEach((a, i) => {
    a.classList.toggle('active', i === index);
  });
  
  await fetchAndRender(chapter.path, chapter.title);
  updateNavButtons();
  window.scrollTo(0, 0);
}

async function fetchAndRender(path, title) {
  markdownContentEl.innerHTML = '<div class="loading-state">載入中...</div>';
  currentTitleEl.textContent = title;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('無法載入文件');
    const md = await response.text();
    markdownContentEl.innerHTML = marked.parse(md);
    
    // Smooth fade in
    markdownContentEl.style.opacity = '0';
    setTimeout(() => {
      markdownContentEl.style.transition = 'opacity 0.5s';
      markdownContentEl.style.opacity = '1';
    }, 10);
  } catch (error) {
    markdownContentEl.innerHTML = `<div class="error">載入失敗: ${error.message}</div>`;
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentChapterIndex === 0;
  nextBtn.disabled = currentChapterIndex === chapters.length - 1;
}

prevBtn.addEventListener('click', () => loadContent(currentChapterIndex - 1));
nextBtn.addEventListener('click', () => loadContent(currentChapterIndex + 1));

// Theme Toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Mobile Menu
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Initialize
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);

initNav();
loadContent(0);
