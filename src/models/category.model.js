const { query } = require('../config/db');

const Category = {
    findAll: () =>
        query('SELECT id, name, description, created_at, updated_at FROM categories ORDER BY name ASC'),

    findById: (id) =>
        query('SELECT id, name, description, created_at, updated_at FROM categories WHERE id = ?', [id])
            .then(rows => rows[0] || null),

    create: ({ name, description = null }) =>
        query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description])
            .then(res => ({id: res.insertId, name, description})),
    
    update: (id, {name, description = null}) =>
        query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id])
            .then(() => Category.findById(id)),

    remove: (id) => query('DELETE FROM categories WHERE id = ?', [id]),

};

module.exports = Category;