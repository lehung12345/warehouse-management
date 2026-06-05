-- ========================
-- USERS (Admin + Staff)
-- ========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- PRODUCTS
-- ========================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    rfid_code TEXT,
    unit TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- LOCATIONS (TREE)
-- ========================
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id INT REFERENCES locations(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('WAREHOUSE','SHELF','BIN')),
    capacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- INVENTORIES (DUY NHẤT)
-- ========================
CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    location_id INT REFERENCES locations(id) ON DELETE CASCADE,
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    min_quantity INT DEFAULT 0 CHECK (min_quantity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, location_id)
);

-- ========================
-- IMPORT ORDERS
-- ========================
CREATE TABLE imports (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    user_id INT REFERENCES users(id),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','PROCESSING','DONE','CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE import_items (
    id SERIAL PRIMARY KEY,
    import_id INT REFERENCES imports(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    scanned_quantity INT DEFAULT 0,
    UNIQUE(import_id, product_id, location_id)
);

-- ========================
-- EXPORT ORDERS
-- ========================
CREATE TABLE exports (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    user_id INT REFERENCES users(id),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','PROCESSING','DONE','CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE export_items (
    id SERIAL PRIMARY KEY,
    export_id INT REFERENCES exports(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    UNIQUE(export_id, product_id, location_id)
);

-- ========================
-- TRANSACTIONS (LOG FULL)
-- ========================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    location_id INT REFERENCES locations(id),
    type TEXT CHECK (type IN ('IMPORT','EXPORT')),
    quantity INT NOT NULL,
    user_id INT REFERENCES users(id),
    reference_id INT, -- id của import/export
    reference_type TEXT CHECK (reference_type IN ('IMPORT','EXPORT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- ORDER SEEN STATUS
-- ========================
CREATE TABLE order_seen_status (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INT NOT NULL,
    order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('IMPORT','EXPORT')),
    seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- INDEX (TỐI ƯU)
-- ========================
CREATE INDEX idx_inventory_product ON inventories(product_id);
CREATE INDEX idx_inventory_location ON inventories(location_id);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_order_seen_user ON order_seen_status(user_id);
CREATE INDEX idx_order_seen_order ON order_seen_status(order_id);
CREATE INDEX idx_order_seen_type ON order_seen_status(order_type);