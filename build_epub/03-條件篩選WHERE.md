# 第 03 章：條件篩選 WHERE 

![WHERE 篩選圖](images/ch03.png)

> **學習目標**
> - 使用 WHERE 子句篩選特定資料
> - 掌握各種比較運算子
> - 使用 AND、OR、NOT 組合條件
> - 使用 LIKE 進行模糊搜尋
> - 使用 IN、BETWEEN 簡化條件

---

## 3.1 WHERE 子句

只查詢**符合條件**的資料，在 `FROM` 後加上 `WHERE`：

```sql
SELECT 欄位 FROM 表格 WHERE 條件;
```

### 範例：只查詢台北的顧客

```sql
SELECT name, city
FROM customers
WHERE city = '台北';
```

結果：
```
name    city
──────  ────
陳小明  台北
吳美玲  台北
劉思穎  台北
```

---

## 3.2 比較運算子

| 運算子 | 說明 | 範例 |
|--------|------|------|
| `=` | 等於 | `city = '台北'` |
| `<>` 或 `!=` | 不等於 | `city <> '台北'` |
| `>` | 大於 | `price > 300` |
| `<` | 小於 | `price < 300` |
| `>=` | 大於等於 | `price >= 350` |
| `<=` | 小於等於 | `stock <= 20` |

### 範例：查詢價格超過 350 元的書

```sql
SELECT title, price
FROM products
WHERE price > 350;
```

結果：
```
title         price
──────────    ─────
海邊的卡夫卡  380
三體          420
恆毅力        350  ← 不包含（需用 >= 350）
黑暗森林      430
```

> ️ **等於**用 `=`，不是 `==`（這是 Python/JavaScript 的寫法）

---

## 3.3 AND 和 OR

### AND（且）— 兩個條件都要滿足

```sql
SELECT title, price, stock
FROM products
WHERE price > 300 AND stock > 30;
```

結果：
```
title       price  stock
──────────  ─────  ─────
挪威的森林  320    45
三體        420    50
哈利波特    360    75
```

### OR（或）— 任一條件滿足即可

```sql
SELECT name, city
FROM customers
WHERE city = '台北' OR city = '台中';
```

結果：
```
name    city
──────  ────
陳小明  台北
林雅婷  台中
吳美玲  台北
劉思穎  台北
```

### 混合使用 AND 和 OR

> ️ `AND` 的優先順序高於 `OR`，**建議用括號明確指定順序**

```sql
--  容易誤解：AND 優先，結果可能不如預期
SELECT * FROM products
WHERE category_id = 1 OR category_id = 2 AND price > 400;

--  用括號明確
SELECT title, category_id, price
FROM products
WHERE (category_id = 1 OR category_id = 2) AND price > 400;
```

---

## 3.4 NOT — 反向條件

```sql
SELECT name, city
FROM customers
WHERE NOT city = '台北';

-- 等同於：
SELECT name, city
FROM customers
WHERE city <> '台北';
```

---

## 3.5 NULL 值處理

**NULL** 代表「沒有值」（不是 0，也不是空字串），需特別處理：

```sql
--  錯誤：NULL 不能用 = 比較
SELECT * FROM products WHERE published_year = NULL;

--  正確：用 IS NULL
SELECT title FROM products WHERE published_year IS NULL;

--  不是 NULL
SELECT title FROM products WHERE published_year IS NOT NULL;
```

---

## 3.6 BETWEEN — 範圍篩選

查詢在某個**範圍內**的資料（包含兩端端點）：

```sql
SELECT 欄位 FROM 表格
WHERE 欄位 BETWEEN 下限 AND 上限;
```

### 範例：查詢價格 300 ~ 400 元的書

```sql
SELECT title, price
FROM products
WHERE price BETWEEN 300 AND 400;
```

等同於：
```sql
WHERE price >= 300 AND price <= 400
```

結果：
```
title         price
──────────    ─────
挪威的森林    320
海邊的卡夫卡  380
單車失竊記    340
哈利波特      360
恆毅力        350
```

### BETWEEN 也適用於日期

```sql
SELECT order_id, order_date
FROM orders
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 3.7 IN — 符合清單中的值

比用多個 `OR` 更簡潔：

```sql
SELECT 欄位 FROM 表格
WHERE 欄位 IN (值1, 值2, 值3);
```

### 範例：查詢台北、台中、高雄的顧客

```sql
--  繁瑣的 OR 寫法
WHERE city = '台北' OR city = '台中' OR city = '高雄'

--  簡潔的 IN 寫法
SELECT name, city
FROM customers
WHERE city IN ('台北', '台中', '高雄');
```

### NOT IN — 排除清單中的值

```sql
SELECT name, city
FROM customers
WHERE city NOT IN ('台北', '台中');
```

---

## 3.8 LIKE — 模糊搜尋

當你不知道完整的值，用 `LIKE` 進行模糊比對：

| 萬用字元 | 代表 | 說明 |
|----------|------|------|
| `%` | 任意多個字元（含 0 個） | `'%村%'` 包含「村」的任何字串 |
| `_` | 一個任意字元 | `'村_春樹'` 第二個字是任意字元 |

### 範例

```sql
-- 名稱中包含「森林」的書
SELECT title FROM products
WHERE title LIKE '%森林%';
-- → 挪威的森林

-- 書名以「海」開頭
SELECT title FROM products
WHERE title LIKE '海%';
-- → 海邊的卡夫卡

-- 書名以「體」結尾
SELECT title FROM products
WHERE title LIKE '%體';
-- → 三體

-- 作者名字是三個字
SELECT name FROM authors
WHERE name LIKE '___';
-- → 村上春樹（四字）× ，吳明益（三字），余華（兩字）×
```

>  SQLite 的 `LIKE` 對**英文不區分大小寫**，但對中文區分。

---

## 3.9 WHERE 子句執行順序

理解 SQL 執行順序有助於寫出正確語句：

```
FROM → WHERE → SELECT
```

1. `FROM customers` — 先找到表格
2. `WHERE city = '台北'` — 篩選符合條件的列
3. `SELECT name, city` — 決定要顯示哪些欄位

> ️ 因此 `WHERE` 子句中**不能使用 `SELECT` 設定的別名**：
> ```sql
> --  錯誤：WHERE 在 SELECT 之前執行，此時別名尚未建立
> SELECT price * 0.9 AS 優惠價
> FROM products
> WHERE 優惠價 < 300;
>
> --  正確：在 WHERE 中使用原始運算式
> SELECT price * 0.9 AS 優惠價
> FROM products
> WHERE price * 0.9 < 300;
> ```

---

## 重點整理

| 語法 | 用途 | 範例 |
|------|------|------|
| `WHERE 欄位 = 值` | 等於條件 | `WHERE city = '台北'` |
| `WHERE 欄位 > 值` | 比較條件 | `WHERE price > 300` |
| `WHERE 條件1 AND 條件2` | 兩個條件都要 | `WHERE ... AND stock > 0` |
| `WHERE 條件1 OR 條件2` | 任一條件即可 | `WHERE city = '台北' OR ...` |
| `WHERE NOT 條件` | 反向條件 | `WHERE NOT city = '台北'` |
| `WHERE 欄位 IS NULL` | 值為 NULL | `WHERE email IS NULL` |
| `WHERE 欄位 BETWEEN a AND b` | 範圍（含端點）| `WHERE price BETWEEN 300 AND 400` |
| `WHERE 欄位 IN (a,b,c)` | 符合清單 | `WHERE city IN ('台北','台中')` |
| `WHERE 欄位 LIKE '%關鍵字%'` | 模糊搜尋 | `WHERE title LIKE '%森林%'` |

---

##  本章練習

1. 查詢庫存為 0 的書籍名稱
2. 查詢 2000 年以後出版的書籍（`published_year >= 2000`）
3. 查詢價格在 300 至 400 元之間的書籍名稱和價格
4. 查詢台北或新竹的顧客姓名和城市
5. 查詢書名中包含「的」字的所有書籍
6. 查詢作者國籍不是日本也不是中國的作者



---


