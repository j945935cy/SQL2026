-- ============================================================
-- 書店管理系統 範例資料庫
-- 適用平台：SQLite
-- 使用方式：sqlite3 bookstore.db < sample-db/setup.sql
-- ============================================================

PRAGMA foreign_keys = ON;

-- ────────────────────────────────────────
-- 清除舊資料（若重新執行時）
-- ────────────────────────────────────────
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS authors;

-- ────────────────────────────────────────
-- 1. 作者表格
-- ────────────────────────────────────────
CREATE TABLE authors (
    author_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    nationality TEXT,
    birth_year  INTEGER
);

INSERT INTO authors (name, nationality, birth_year) VALUES
    ('村上春樹',   '日本', 1949),
    ('余華',       '中國', 1960),
    ('吳明益',     '台灣', 1971),
    ('劉慈欣',     '中國', 1963),
    ('J.K. 羅琳',  '英國', 1965),
    ('安潔拉·達克沃斯', '美國', 1970),
    ('馬克·吐溫',  '美國', 1835),
    ('張愛玲',     '中國', 1920);

-- ────────────────────────────────────────
-- 2. 書籍分類表格
-- ────────────────────────────────────────
CREATE TABLE categories (
    category_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT    NOT NULL UNIQUE
);

INSERT INTO categories (category_name) VALUES
    ('文學小說'),
    ('科幻'),
    ('心理勵志'),
    ('歷史'),
    ('兒童讀物');

-- ────────────────────────────────────────
-- 3. 書籍商品表格
-- ────────────────────────────────────────
CREATE TABLE products (
    product_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    author_id   INTEGER REFERENCES authors(author_id),
    category_id INTEGER REFERENCES categories(category_id),
    price       REAL    NOT NULL CHECK (price >= 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    published_year INTEGER
);

INSERT INTO products (title, author_id, category_id, price, stock, published_year) VALUES
    ('挪威的森林',         1, 1, 320, 45, 1987),
    ('海邊的卡夫卡',       1, 1, 380, 32, 2002),
    ('活著',               2, 1, 280, 60, 1993),
    ('單車失竊記',         3, 1, 340, 28, 2015),
    ('三體',               4, 2, 420, 50, 2006),
    ('哈利波特：魔法石',   5, 5, 360, 75, 1997),
    ('恆毅力',             6, 3, 350, 40, 2016),
    ('傳說',               2, 1, 290, 15, 2022),
    ('死水微瀾',           8, 1, 260,  0, 1944),
    ('黑暗森林',           4, 2, 430, 22, 2008);

-- ────────────────────────────────────────
-- 4. 顧客表格
-- ────────────────────────────────────────
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    city        TEXT,
    joined_date TEXT    NOT NULL DEFAULT (DATE('now'))
);

INSERT INTO customers (name, email, city, joined_date) VALUES
    ('陳小明', 'ming@example.com',    '台北', '2024-01-15'),
    ('林雅婷', 'yating@example.com',  '台中', '2024-03-22'),
    ('王志偉', 'wei@example.com',     '高雄', '2024-05-10'),
    ('吳美玲', 'meiling@example.com', '台北', '2024-07-08'),
    ('黃建宏', 'hong@example.com',    '新竹', '2024-09-30'),
    ('張宇航', 'yu@example.com',      '台南', '2025-01-20'),
    ('劉思穎', 'ying@example.com',    '台北', '2025-03-05'),
    ('周靜怡', 'jing@example.com',    '桃園', '2025-06-18');

-- ────────────────────────────────────────
-- 5. 訂單表格
-- ────────────────────────────────────────
CREATE TABLE orders (
    order_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    order_date  TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','shipped','completed','cancelled'))
);

INSERT INTO orders (customer_id, order_date, status) VALUES
    (1, '2025-02-01', 'completed'),
    (1, '2025-05-15', 'completed'),
    (2, '2025-03-10', 'completed'),
    (3, '2025-04-22', 'shipped'),
    (4, '2025-06-01', 'pending'),
    (5, '2025-06-10', 'completed'),
    (6, '2025-07-05', 'shipped'),
    (7, '2025-08-20', 'cancelled'),
    (1, '2026-01-10', 'completed'),
    (8, '2026-02-14', 'pending');

-- ────────────────────────────────────────
-- 6. 訂單明細表格
-- ────────────────────────────────────────
CREATE TABLE order_items (
    item_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders(order_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price REAL    NOT NULL
);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1,  1, 1, 320),
    (1,  5, 2, 420),
    (2,  7, 1, 350),
    (3,  3, 2, 280),
    (3,  6, 1, 360),
    (4,  2, 1, 380),
    (5,  8, 3, 290),
    (6,  4, 1, 340),
    (6,  9, 1, 260),
    (7,  10, 1, 430),
    (8,  1, 2, 320),
    (9,  5, 1, 420),
    (9,  10, 2, 430),
    (10, 6, 1, 360);

-- ────────────────────────────────────────
-- 驗證資料
-- ────────────────────────────────────────
SELECT '作者數量：'     || COUNT(*) FROM authors;
SELECT '分類數量：'     || COUNT(*) FROM categories;
SELECT '書籍數量：'     || COUNT(*) FROM products;
SELECT '顧客數量：'     || COUNT(*) FROM customers;
SELECT '訂單數量：'     || COUNT(*) FROM orders;
SELECT '訂單明細數量：' || COUNT(*) FROM order_items;
