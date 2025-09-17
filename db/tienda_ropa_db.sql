CREATE DATABASE tienda_ropa_db;

USE tienda_ropa_db;

CREATE TABLE categories (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_categories_name UNIQUE (name)
);

CREATE TABLE products (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(60) NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    description VARCHAR(255),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_products_category_id (category_id),
    UNIQUE KEY uq_products_sku (sku),
    
    CONSTRAINT fk_products_category
		FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        
   CONSTRAINT chk_price_nonnegative CHECK (price >= 0),
   CONSTRAINT chk_stock_nonnegative CHECK (stock >= 0)
);

##DATOS DE PRUEBA INICIALES categories

INSERT INTO categories (name, description) VALUES 
('Camisetas', 'Camisetas básicas y estampadas'),
('Pantalones', 'Jeans, joggers y más'),
('Accesorios', 'Gorras, cinturones, bufandas');

SELECT * FROM categories;

##DATOS DE PRUEBA INICIALES products

INSERT INTO products (category_id, name, sku, price, stock, description) VALUES 
(1, 'Camiseta Blanca', 'TSH-WHT-001', 39999, 50, 'Camiseta de algodón 100%'),
(1, 'Camiseta Negra', 'TSH-BLK-002', 39999, 35, 'Camiseta cuello redondo'),
(2, 'Jean Slim Azul', 'JEAN-BLU-101', 119999, 25, 'Corte slim'),
(3, 'Gorra Logo', 'CAP-LOG-777', 49999, 15, 'Gorra ajustable');

SELECT * FROM products;

##Relacion entre productos y categorias

SELECT p.id, p.name AS product, c.name AS category, p.price, p.stock
FROM products p
INNER JOIN categories c ON c.id = p.category_id;