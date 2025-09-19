const { query } = require('../config/db');

const baseSelect = `
    SELECT p.id, p.category_id, c.name AS category_name,
            p.name, p.sku, p.price, p.stock, p.description,
            p.created_at, p.updated_at
    FROM products p
    JOIN categories c ON c.id = p.category_id
    `;

const Product = {
    findAll: () => query(baseSelect + ' ORDER BY p.created_at DESC'),

    findById: (id) =>
        query(baseSelect + ' WHERE p.id = ?', [id]).then(rows => rows[0] || null),

    findByCategory: (categoryId) =>
        query(baseSelect + ' WHERE p.category_id = ? ORDER BY p.name ASC', [categoryId]),

    create: ({ category_id, name, sku = null, price = 0, stock = 0, description = null }) =>
        query(
        'INSERT INTO products (category_id, name, sku, price, stock, description) VALUES (?, ?, ?, ?, ?, ?)',
        [category_id, name, sku, price, stock, description]
        ).then(res => Product.findById(res.insertId)),

    update: (id, { category_id, name, sku = null, price = 0, stock = 0, description = null }) =>
        query(
        `UPDATE products
        SET category_id = ?, name = ?, sku = ?, price = ?, stock = ?, description = ?
        WHERE id = ?`,
        [category_id, name, sku, price, stock, description, id]
        ).then(() => Product.findById(id)),

    remove: (id) => query('DELETE FROM products WHERE id = ?', [id]),
};

module.exports = Product;