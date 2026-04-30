# 第 02 章：基本查詢 SELECT {#ch02}

![SELECT 查詢圖](../images/ch02.png)

> **學習目標**
> - 掌握 SELECT 語句的基本結構
> - 查詢特定欄位與所有欄位
> - 使用 AS 設定欄位別名
> - 使用 DISTINCT 去除重複
> - 了解 SQL 書寫規範

---

## 2.1 SELECT 語句基本結構

`SELECT` 是 SQL 最常用的指令，用來「讀取」資料庫中的資料。

### 最簡單的語法

```sql
SELECT 欄位名稱 FROM 表格名稱;
```

就像問資料庫：「請給我 **[表格]** 裡的 **[欄位]** 資料」

### 範例：查詢所有顧客的姓名

```sql
SELECT name FROM customers;
```

結果：
```
name
────────
陳小明
林雅婷
王志偉
吳美玲
黃建宏
張宇航
劉思穎
周靜怡
```

---

## 2.2 查詢多個欄位

用**逗號**分隔多個欄位名稱：

```sql
SELECT 欄位1, 欄位2, 欄位3 FROM 表格名稱;
```

### 範例：查詢顧客的姓名和城市

```sql
SELECT name, city FROM customers;
```

結果：
```
name    city
──────  ────
陳小明  台北
林雅婷  台中
王志偉  高雄
吳美玲  台北
黃建宏  新竹
張宇航  台南
劉思穎  台北
周靜怡  桃園
```

---

## 2.3 查詢所有欄位（SELECT *）

使用 `*`（星號）代表「所有欄位」：

```sql
SELECT * FROM 表格名稱;
```

### 範例：查詢所有書籍分類

```sql
SELECT * FROM categories;
```

結果：
```
category_id  category_name
───────────  ─────────────
1            文學小說
2            科幻
3            心理勵志
4            歷史
5            兒童讀物
```

> ⚠️ **注意**：`SELECT *` 在學習時很方便，但在實際開發中，建議**明確列出需要的欄位**，避免取出不必要的資料影響效能。

---

## 2.4 欄位別名（AS）

有時欄位名稱是英文，或想讓輸出標題更易讀，可用 `AS` 設定**別名**：

```sql
SELECT 欄位名稱 AS 別名 FROM 表格名稱;
```

### 範例：用中文標題顯示書籍資訊

```sql
SELECT
    title       AS 書名,
    price       AS 售價,
    stock       AS 庫存數量
FROM products;
```

結果：
```
書名              售價   庫存數量
──────────────    ───    ──────
挪威的森林        320    45
海邊的卡夫卡      380    32
活著              280    60
...
```

### 別名使用規則

- `AS` 可以省略：`SELECT name 顧客姓名 FROM customers;`（不建議，可讀性差）
- 別名含有空格時，需用**雙引號**包住：`SELECT price AS "售 價"`
- 別名只影響輸出標題，不改變實際欄位名稱

---

## 2.5 在查詢中進行計算

SELECT 不只是顯示欄位，也可以進行**數學運算**：

```sql
SELECT
    title             AS 書名,
    price             AS 原價,
    price * 0.9       AS 九折優惠價,
    price * 0.8       AS 八折優惠價
FROM products;
```

結果：
```
書名            原價   九折優惠價  八折優惠價
──────────────  ───    ──────────  ──────────
挪威的森林      320    288.0       256.0
海邊的卡夫卡    380    342.0       304.0
活著            280    252.0       224.0
```

### 常用算術運算子

| 運算子 | 說明 | 範例 |
|--------|------|------|
| `+` | 加法 | `price + 50` |
| `-` | 減法 | `price - 30` |
| `*` | 乘法 | `price * 1.1` |
| `/` | 除法 | `price / 2` |
| `%` | 取餘數 | `stock % 10` |

---

## 2.6 去除重複（DISTINCT）

當查詢結果有重複值時，可用 `DISTINCT` 只顯示不重複的值：

```sql
SELECT DISTINCT 欄位名稱 FROM 表格名稱;
```

### 範例：查詢顧客來自哪些城市（不重複）

```sql
-- 沒有 DISTINCT（有重複）
SELECT city FROM customers;
```
```
台北  ← 重複
台中
高雄
台北  ← 重複
新竹
台南
台北  ← 重複
桃園
```

```sql
-- 加上 DISTINCT（去除重複）
SELECT DISTINCT city FROM customers;
```
```
台北
台中
高雄
新竹
台南
桃園
```

### DISTINCT 作用於多欄位

`DISTINCT` 會對**所有選取欄位的組合**去重：

```sql
SELECT DISTINCT city, joined_date FROM customers;
-- 城市+加入日期的組合不重複
```

---

## 2.7 字串連接

SQLite 使用 `||` 運算子連接字串：

```sql
SELECT
    name || '（' || city || '）' AS 顧客資訊
FROM customers;
```

結果：
```
顧客資訊
──────────────
陳小明（台北）
林雅婷（台中）
王志偉（高雄）
...
```

---

## 2.8 SQL 書寫規範

良好的書寫習慣讓 SQL 更易讀：

### 大小寫慣例

- **SQL 關鍵字**習慣大寫：`SELECT`、`FROM`、`WHERE`
- **表格和欄位名稱**小寫：`customers`、`name`
- SQL 本身**不分大小寫**（`select` 和 `SELECT` 效果相同）

### 縮排與換行

```sql
-- ❌ 難以閱讀
SELECT title,price,stock FROM products;

-- ✅ 清晰易讀
SELECT
    title,
    price,
    stock
FROM products;
```

### 分號

- SQL 語句以**分號 `;`** 結尾
- 在 SQLite 互動介面中，沒有分號不會執行
- 多條語句一起執行時，分號是必要的

### 註解

```sql
-- 這是單行註解

/* 這是
   多行註解 */

SELECT name  -- 這也是行末註解
FROM customers;
```

---

## 重點整理

| 語法 | 用途 |
|------|------|
| `SELECT 欄位 FROM 表格` | 基本查詢 |
| `SELECT *` | 查詢所有欄位 |
| `SELECT 欄位 AS 別名` | 設定輸出標題 |
| `SELECT 欄位1, 欄位2` | 查詢多個欄位 |
| `SELECT DISTINCT 欄位` | 去除重複值 |
| `SELECT 欄位 * 0.9` | 計算運算 |
| `欄位1 \|\| 欄位2` | 字串連接 |

---

## 📝 本章練習

1. 查詢所有作者的姓名（`name`）和國籍（`nationality`）
2. 查詢所有書籍的書名和價格，並將欄位命名為中文「書名」「售價」
3. 查詢書籍名稱、原價，以及打九折後的價格（欄位名稱：優惠價）
4. 查詢顧客來自哪些不同的城市（去除重複）
5. 將作者姓名和國籍合併顯示，格式為「村上春樹（日本）」

→ [查看答案](../exercises/答案-初級.md#第02章)


