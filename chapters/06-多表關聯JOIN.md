# 第 06 章：多表關聯 JOIN {#ch06}

> **學習目標**
> - 理解為何需要多表關聯
> - 掌握 INNER JOIN、LEFT JOIN 的語法與差異
> - 進行三張以上表格的多重 JOIN
> - 使用表格別名簡化查詢

---

## 6.1 為什麼需要 JOIN？

資料庫中的資料分散在多張表格。  
例如，`products` 只存 `author_id`，實際作者姓名在 `authors` 裡：

```
products                    authors
──────────────────────      ──────────────────
product_id │ title          author_id │ name
           │ author_id ──┐           │
                         └─► 1       │ 村上春樹
                             2       │ 余華
```

若要查詢「書名 + 作者姓名」，需要**連接**兩張表格。

---

## 6.2 INNER JOIN（內連接）

只回傳**兩張表格都有對應資料**的列：

```sql
SELECT 欄位
FROM 表格A
INNER JOIN 表格B ON 表格A.連接欄位 = 表格B.連接欄位;
```

### 範例：查詢書籍和作者姓名

```sql
SELECT
    products.title  AS 書名,
    authors.name    AS 作者
FROM products
INNER JOIN authors ON products.author_id = authors.author_id;
```

結果：
```
書名              作者
──────────────    ──────────
挪威的森林        村上春樹
海邊的卡夫卡      村上春樹
活著              余華
單車失竊記        吳明益
三體              劉慈欣
哈利波特：魔法石  J.K. 羅琳
恆毅力            安潔拉·達克沃斯
傳說              余華
死水微瀾          張愛玲
黑暗森林          劉慈欣
```

> **注意**：`INNER JOIN` 可簡寫為 `JOIN`，兩者完全相同。

---

## 6.3 使用表格別名

表格名稱太長時，可設定別名（慣例用 1~2 個字母）：

```sql
SELECT
    p.title  AS 書名,
    a.name   AS 作者
FROM products p
JOIN authors a ON p.author_id = a.author_id;
```

這樣寫更簡潔，尤其是三張以上表格時非常重要。

---

## 6.4 LEFT JOIN（左外連接）

回傳**左表格所有列**，右表格有對應資料就顯示，沒有則顯示 NULL：

```sql
SELECT 欄位
FROM 左表格
LEFT JOIN 右表格 ON 左表格.連接欄位 = 右表格.連接欄位;
```

### 範例：查詢所有作者，有沒有書都顯示

```sql
SELECT
    a.name       AS 作者,
    p.title      AS 書名
FROM authors a
LEFT JOIN products p ON a.author_id = p.author_id;
```

結果：
```
作者              書名
──────────────    ──────────────────
村上春樹          挪威的森林
村上春樹          海邊的卡夫卡
余華              活著
余華              傳說
吳明益            單車失竊記
劉慈欣            三體
劉慈欣            黑暗森林
J.K. 羅琳         哈利波特：魔法石
安潔拉·達克沃斯   恆毅力
馬克·吐溫         NULL          ← 沒有書，顯示 NULL
張愛玲            死水微瀾
```

### 找出沒有書的作者

```sql
SELECT a.name AS 作者
FROM authors a
LEFT JOIN products p ON a.author_id = p.author_id
WHERE p.product_id IS NULL;
```
```
作者
──────
馬克·吐溫
```

---

## 6.5 INNER JOIN vs LEFT JOIN

| 類型 | 說明 | 使用時機 |
|------|------|----------|
| INNER JOIN | 只有兩側都有資料才顯示 | 確定有對應資料時 |
| LEFT JOIN | 左側全部顯示，右側沒資料顯示 NULL | 想保留左側所有資料 |

```
INNER JOIN 結果：
   A ∩ B（交集）

LEFT JOIN 結果：
   A 的全部 + B 有對應的部分
```

---

## 6.6 連接三張以上表格

### 範例：書名 + 作者 + 分類

```sql
SELECT
    p.title         AS 書名,
    a.name          AS 作者,
    c.category_name AS 分類
FROM products p
JOIN authors a    ON p.author_id   = a.author_id
JOIN categories c ON p.category_id = c.category_id
ORDER BY c.category_name, p.price;
```

結果：
```
書名              作者              分類
──────────────    ──────────────    ────────
哈利波特          J.K. 羅琳         兒童讀物
挪威的森林        村上春樹          文學小說
海邊的卡夫卡      村上春樹          文學小說
活著              余華              文學小說
...
三體              劉慈欣            科幻
黑暗森林          劉慈欣            科幻
恆毅力            安潔拉·達克沃斯   心理勵志
```

---

## 6.7 跨四張表格：訂單明細查詢

```sql
SELECT
    c.name         AS 顧客,
    o.order_date   AS 訂購日期,
    p.title        AS 書名,
    oi.quantity    AS 數量,
    oi.unit_price  AS 單價,
    oi.quantity * oi.unit_price AS 小計
FROM order_items oi
JOIN orders   o ON oi.order_id  = o.order_id
JOIN customers c ON o.customer_id = c.customer_id
JOIN products  p ON oi.product_id = p.product_id
ORDER BY o.order_date, c.name;
```

---

## 6.8 JOIN 搭配 WHERE 和聚合

### 範例：各顧客的訂單總金額

```sql
SELECT
    c.name             AS 顧客,
    COUNT(DISTINCT o.order_id)   AS 訂單數,
    SUM(oi.quantity * oi.unit_price) AS 消費總額
FROM customers c
JOIN orders o      ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status != 'cancelled'
GROUP BY c.customer_id, c.name
ORDER BY 消費總額 DESC;
```

---

## 6.9 常見錯誤與注意事項

### 1. 欄位名稱衝突

多張表格有同名欄位（如 `name`），必須加上表格名稱：

```sql
-- ❌ 錯誤：不清楚是哪張表格的 name
SELECT name FROM customers JOIN authors ...

-- ✅ 正確：指定表格
SELECT customers.name, authors.name ...
-- 或使用別名區分
SELECT c.name AS 顧客, a.name AS 作者 ...
```

### 2. 忘記 ON 條件（產生笛卡兒積）

```sql
-- ❌ 非常危險：忘記 ON，產生所有組合（笛卡兒積）
SELECT * FROM customers JOIN orders;
-- 8 位顧客 × 10 筆訂單 = 80 列（完全錯誤的結果）

-- ✅ 正確
SELECT * FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;
```

---

## 重點整理

| 語法 | 說明 |
|------|------|
| `FROM A JOIN B ON A.id = B.id` | 內連接（兩側都有才顯示）|
| `FROM A LEFT JOIN B ON A.id = B.id` | 左外連接（左側全部顯示）|
| `FROM A JOIN B ON ... JOIN C ON ...` | 多表連接 |
| `FROM 表格 AS 別名` | 設定表格別名 |
| `WHERE 右表格.主鍵 IS NULL` | 找出左側沒有對應的資料 |

---

## 📝 本章練習

1. 查詢所有書籍的書名和所屬分類名稱
2. 查詢所有訂單的訂單編號、顧客姓名、訂購日期
3. 查詢顧客「陳小明」的所有訂購書籍名稱和數量
4. 使用 LEFT JOIN 找出從未下單的顧客（`orders` 中沒有記錄）
5. 查詢每位顧客的訂單數量（用 LEFT JOIN，沒有訂單的顯示 0）

→ [查看答案](../exercises/答案-中級.md#第06章)


