-- File: database/schema.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_date DATE NOT NULL,
    location TEXT NOT NULL,
    total_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some data
INSERT INTO inventory (name, description, price, image_url, category) VALUES
('Big Blue Kettle', 'Classic 57cm dome', 450.00, 'https://picsum.photos/seed/grill1/400/300', 'Grill'),
('Gas Grill Pro', '4-Burner gas grill', 800.00, 'https://picsum.photos/seed/grill2/400/300', 'Grill');