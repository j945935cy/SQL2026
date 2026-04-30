# SQLite 速查表 Cheat Sheet

> 適用平台：SQLite　｜　語言：繁體中文

---

## 一、查詢資料（SELECT）

```sql
-- 基本查詢
SELECT 欄位1, 欄位2 FROM 表格;
SELECT * FROM 表格;

-- 別名
SELECT 欄位 AS 別名 FROM 表格;

-- 去除重複
SELECT DISTINCT 欄位 FROM 表格;

-- 計算欄位
SELECT price * 0.9 AS 折扣價 FROM products;

-- 字串連接
SELECT name || '（' || city || '）' FROM customers;
```

---

## 二、篩選條件（WHERE）

```sql
-- 比較運算子
WHERE price = 300
WHERE price <> 300     -- 不等於
WHERE price > 300
WHERE price >= 300
WHERE price < 300
WHERE price <= 300

-- 邏輯運算子
WHERE 條件1 AND 條件2
WHERE 條件1 OR 條件2
WHERE NOT 條件

-- NULL 判斷
WHERE 欄位 IS NULL
WHERE 欄位 IS NOT NULL

-- 範圍（含端點）
WHERE price BETWEEN 300 AND 400

-- 清單比對
WHERE city IN ('台北', '台中', '高雄')
WHERE city NOT IN ('台北', '台中')

-- 模糊搜尋
WHERE title LIKE '%森林%'   -- 包含「森林」
WHERE title LIKE '海%'      -- 以「海」開頭
WHERE title LIKE '%樹'      -- 以「樹」結尾
WHERE name LIKE '___'       -- 恰好三個字元
```

---

## 三、排序與限制

```sql
-- 排序（ASC 升冪預設，DESC 降冪）
ORDER BY price
ORDER BY price DESC
ORDER BY category_id ASC, price DESC   -- 多欄位排序

-- 限制筆數
LIMIT 10

-- 分頁（跳過前 N 筆）
LIMIT 10 OFFSET 20   -- 第 3 頁（每頁 10 筆）
```

---

## 四、聚合函數與分組

```sql
-- 聚合函數
COUNT(*)          -- 列數（含 NULL）
COUNT(欄位)       -- 非 NULL 列數
SUM(欄位)         -- 加總
AVG(欄位)         -- 平均
MAX(欄位)         -- 最大值
MIN(欄位)         -- 最小值
ROUND(數值, N)    -- 四捨五入到 N 位小數

-- 分組
GROUP BY 欄位
GROUP BY 欄位1, 欄位2

-- 篩選分組結果（只能用聚合函數比較）
HAVING COUNT(*) > 5
HAVING AVG(price) >= 300
```

---

## 五、多表關聯（JOIN）

```sql
-- INNER JOIN（只顯示兩側都有資料的列）
SELECT p.title, a.name
FROM products p
JOIN authors a ON p.author_id = a.author_id;

-- LEFT JOIN（左側全部顯示，右側無則為 NULL）
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- 三表關聯
FROM products p
JOIN authors a    ON p.author_id   = a.author_id
JOIN categories c ON p.category_id = c.category_id;

-- 找出「右側無對應」的資料
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

---

## 六、子查詢

```sql
-- WHERE 中的子查詢（單一值）
WHERE price > (SELECT AVG(price) FROM products)

-- WHERE 中的子查詢（多值）
WHERE author_id IN (SELECT author_id FROM authors WHERE nationality = '日本')

-- FROM 中的子查詢（衍生表格，必須設別名）
FROM (SELECT ... FROM ...) AS 別名

-- EXISTS（判斷子查詢是否有結果）
WHERE EXISTS (SELECT 1 FROM orders WHERE customer_id = c.customer_id)
WHERE NOT EXISTS (...)
```

---

## 七、新增、修改、刪除

```sql
-- 新增一筆
INSERT INTO 表格 (欄位1, 欄位2) VALUES (值1, 值2);

-- 新增多筆
INSERT INTO 表格 (欄位1, 欄位2) VALUES
    (值1a, 值2a),
    (值1b, 值2b);

-- 修改（一定要加 WHERE！）
UPDATE 表格
SET 欄位1 = 值1, 欄位2 = 值2
WHERE 條件;

-- 刪除（一定要加 WHERE！）
DELETE FROM 表格 WHERE 條件;

-- 交易
BEGIN;
  -- 多條 SQL 語句
COMMIT;    -- 全部成功
-- 或
ROLLBACK;  -- 發生問題，回復
```

---

## 八、建立與管理表格

```sql
-- 建立表格
CREATE TABLE IF NOT EXISTS 表格 (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    欄位    類型    限制條件,
    ...
);

-- 修改表格：新增欄位
ALTER TABLE 表格 ADD COLUMN 欄位 類型;

-- 修改表格：重新命名表格
ALTER TABLE 舊名稱 RENAME TO 新名稱;

-- 刪除表格
DROP TABLE IF EXISTS 表格;

-- 建立索引
CREATE INDEX idx_名稱 ON 表格 (欄位);
CREATE UNIQUE INDEX idx_名稱 ON 表格 (欄位);

-- 刪除索引
DROP INDEX IF EXISTS idx_名稱;
```

---

## 九、SQLite 常用函數

### 字串函數

| 函數 | 說明 | 範例 |
|------|------|------|
| `LENGTH(s)` | 字串長度 | `LENGTH('台灣')` → `2` |
| `UPPER(s)` | 轉大寫 | `UPPER('abc')` → `ABC` |
| `LOWER(s)` | 轉小寫 | `LOWER('ABC')` → `abc` |
| `TRIM(s)` | 移除前後空白 | `TRIM(' abc ')` → `abc` |
| `SUBSTR(s, start, len)` | 取子字串 | `SUBSTR('台北市', 1, 2)` → `台北` |
| `REPLACE(s, old, new)` | 取代字串 | `REPLACE('台北', '北', '中')` → `台中` |
| `INSTR(s, sub)` | 子字串位置 | `INSTR('台北市', '北')` → `2` |

### 數值函數

| 函數 | 說明 |
|------|------|
| `ROUND(x, n)` | 四捨五入 |
| `ABS(x)` | 絕對值 |
| `MAX(x, y)` | 兩值中較大者（非聚合）|
| `MIN(x, y)` | 兩值中較小者（非聚合）|

### 日期函數

| 函數 | 說明 | 範例結果 |
|------|------|----------|
| `DATE('now')` | 今天日期 | `2026-04-29` |
| `DATETIME('now')` | 現在日期時間 | `2026-04-29 10:30:00` |
| `DATE('now', '-7 days')` | 7 天前 | `2026-04-22` |
| `STRFTIME('%Y', '2026-04-29')` | 取年份 | `2026` |
| `STRFTIME('%m', '2026-04-29')` | 取月份 | `04` |

---

## 十、SQL 完整語句順序

```sql
SELECT   欄位、聚合函數、別名
FROM     表格（可加 JOIN）
WHERE    原始列的篩選條件（不能用聚合函數）
GROUP BY 分組欄位
HAVING   分組後的篩選條件（可用聚合函數）
ORDER BY 排序欄位 [ASC|DESC]
LIMIT    回傳筆數
OFFSET   跳過筆數;
```

---

## 十一、SQLite 互動介面命令

| 命令 | 說明 |
|------|------|
| `.tables` | 列出所有表格 |
| `.schema 表格` | 顯示建立語句 |
| `.headers on` | 顯示欄位標題 |
| `.mode column` | 欄位對齊模式 |
| `.mode csv` | CSV 格式輸出 |
| `.output 檔案.csv` | 輸出到檔案 |
| `.output stdout` | 恢復輸出到螢幕 |
| `.read 檔案.sql` | 執行 SQL 檔案 |
| `.quit` | 離開 SQLite |

---

## 十二、常見限制條件

| 限制 | 說明 |
|------|------|
| `PRIMARY KEY` | 主鍵（唯一 + NOT NULL）|
| `AUTOINCREMENT` | 自動遞增（搭配 INTEGER PRIMARY KEY）|
| `NOT NULL` | 不能為空 |
| `UNIQUE` | 值唯一 |
| `DEFAULT 值` | 預設值 |
| `CHECK (條件)` | 值的規則驗證 |
| `REFERENCES 表格(欄位)` | 外鍵 |
