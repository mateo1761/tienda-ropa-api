const Product = require('../models/product.model');
const Category = require('../models/category.model');

function boom(message, status = 400, code = 'BAD_REQUEST') {
    const err = new Error(message);
    err.status = status;
    err.code = code;
    return err;
}

function numOr(value, fallback) {
    const n = Number(value);

    return Number.isFinite(n) ? n : fallback;
}

module.exports = {
    async list(filters = {}) {
        const { category_id } = filters;

        if (category_id) return Product.findByCategory(category_id);

        return Product.findAll();
    },

    async get(id) {
        const prod = await Product.findById(id);

        if (!prod) throw boom('Producto no encontrado', 404, 'NOT_FOUND');

        return prod
    },

    async create(data) {
        const { category_id, name, sku = null } = data || {};
        let { price = 0, stock = 0, description = null } = data || {};

        if (!category_id) throw boom('category_id es requerido', 400, 'VALIDATION_ERROR');
        if (!name || typeof name !== 'string') throw boom('name es requerido y debe ser string', 400, 'VALIDATION_ERROR');

        price = numOr(price, 0);
        stock = numOr(stock, 0);

        if (price < 0 || stock < 0) throw boom('price/stock no pueden ser negativos', 400, 'VALIDATION_ERROR');

        const cat = await Category.findById(category_id);

        if (!cat) throw boom('category_id no existe', 400, 'CATEGORY_NOT_FOUND');

        try {
            return await Product.create({ category_id, name: name.trim(), sku, price, stock, description })
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw boom('SKU duplicado', 409, 'DUP_SKU');
            if (error.code === 'ER_NO_REFERENCED_ROW_2') throw boom('category_id no existe', 400, 'CATEGORY_NOT_FOUND');
            throw error;
        }
    },

    async update(id, data = {}) {
        const current = await Product.findById(id);

        if(!current) throw boom('Producto no encontrado', 404, 'NOT_FOUND');

        const payload = {
            category_id: data.category_id ?? current.category_id,
            name: (data.name ?? current.name),
            sku: data.sku ?? current.sku,
            price: numOr(data.price ?? current.price, current.price),
            stock: numOr(data.stock ?? current.stock, current.stock),
            description: data.description ?? current.description
        };

        if (!payload.name || typeof payload.name !== 'string') {
            throw boom('name es requerido y debe ser string', 400, 'VALIDATION_ERROR');
        }

        if (payload.price < 0 || payload.stock < 0) {
            throw boom('price/stock no pueden ser negativos', 400, 'VALIDATION_ERROR');
        }

        if (payload.category_id !== current.category_id) {
            const cat = await Category.findById(payload.category_id);
            if (!cat) throw boom('category_id no existe', 400, 'CATEGORY_NOT_FOUND');
        }

        try {
            return await Product.update(id, payload)
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw boom('SKU duplicado', 409, 'DUP_SKU');
            if (error.code === 'ER_NO_REFERENCED_ROW_2') throw boom('category_id no existe', 400, 'CATEGORY_NOT_FOUND');
            throw error;
        }
    },

    async remove(id) {
        const current = await Product.remove(id);

        if (!current) throw boom('Producto no encontrado', 404, 'NOT_FOUND');

        await Product.remove(id);
    }
}