# SQLite 從零開始：初學者完整學習指南

> 適合對象：完全無資料庫基礎的初學者  
> 資料庫平台：SQLite  
> 語言：繁體中文  
> 更新日期：2026 年 4 月

---

## 📚 目錄

### 電子書章節

| 章節 | 主題 | 說明 |
|------|------|------|
| [第 01 章](chapters/01-資料庫簡介.md) | 資料庫簡介 | 什麼是資料庫？關聯式資料庫概念、SQLite 安裝 |
| [第 02 章](chapters/02-基本查詢SELECT.md) | 基本查詢 SELECT | 讀取資料、欄位選取、別名 |
| [第 03 章](chapters/03-條件篩選WHERE.md) | 條件篩選 WHERE | 比較運算子、邏輯運算子、LIKE、IN、BETWEEN |
| [第 04 章](chapters/04-排序與限制.md) | 排序與限制 | ORDER BY、LIMIT、OFFSET |
| [第 05 章](chapters/05-聚合函數與分組.md) | 聚合函數與分組 | COUNT、SUM、AVG、MAX、MIN、GROUP BY、HAVING |
| [第 06 章](chapters/06-多表關聯JOIN.md) | 多表關聯 JOIN | INNER JOIN、LEFT JOIN、多表合併 |
| [第 07 章](chapters/07-子查詢.md) | 子查詢 | 巢狀查詢、相關子查詢、EXISTS |
| [第 08 章](chapters/08-新增修改刪除.md) | 新增、修改、刪除 | INSERT、UPDATE、DELETE |
| [第 09 章](chapters/09-建立與管理表格.md) | 建立與管理表格 | CREATE TABLE、ALTER TABLE、DROP TABLE、索引 |

### 其他資源

- [速查表 Cheat Sheet](cheatsheet.md) — 常用語法一覽
- [練習題庫（初級）](exercises/練習題-初級.md) — 基礎 SELECT 練習
- [練習題庫（中級）](exercises/練習題-中級.md) — JOIN、聚合、子查詢練習
- [練習題答案（初級）](exercises/答案-初級.md)
- [練習題答案（中級）](exercises/答案-中級.md)
- [範例資料庫建置腳本](sample-db/setup.sql) — 本書所有範例使用的資料庫

---

## 🗂️ 範例資料庫說明

本書使用一個「書店管理系統」作為貫穿全書的範例，包含以下五張表格：

```
customers  ──┐
              ├── orders ──── order_items ──── products
authors    ──┘                                     │
                                               categories
```

| 表格 | 說明 |
|------|------|
| `customers` | 顧客資料 |
| `products` | 書籍商品資料 |
| `categories` | 書籍分類 |
| `orders` | 訂單資料 |
| `order_items` | 訂單明細 |
| `authors` | 作者資料 |

---

## 🚀 快速開始

1. 安裝 SQLite（參閱第 01 章）
2. 執行範例資料庫腳本：
   ```bash
   sqlite3 bookstore.db < sample-db/setup.sql
   ```
3. 從第 01 章開始閱讀，每章末有練習題

---

## 💡 學習建議

- 每章閱讀完後，務必親手執行範例 SQL
- 遇到不懂的語法，查閱[速查表](cheatsheet.md)
- 完成各章練習題，鞏固學習成果
- 不要死背語法，理解「為什麼這樣寫」更重要
