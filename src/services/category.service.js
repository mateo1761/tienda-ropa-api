const Category = require('../models/category.model');

function boom(message, status = 400, code = 'BAD_REQUEST') {
    const err = new Error(message);
    err.status = status;
    err.code = code;
    return err;
}

module.exports = {
    async list() {
        return Category.findAll();
    },

    async get(id) {
        const cat = await Category.findById(id);
        if (!cat) throw boom('Categoría no encontrada', 404, 'NOT_FOUND');
        return cat;
    },

    async create(data) {
        const { name, description = null } = data || {};

        if (!name || typeof name !== 'string') {
            throw boom('name es requerido y debe ser string', 400, 'VALIDATION_ERROR');
        }

        try {
            return await Category.create({ name: name.trim(), description });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw boom('La categoría ya existe (name único)', 409, 'DUP_CATEGORY_NAME')
            }
            throw error;
        }
    },

    async update(id, data) {
        const current = await Category.findById(id);
        if (!current) throw boom('Categoría no encontrada', 404, 'NOT_FOUND');

        const name = data.name;
        const description = data.description;

        if (!name || typeof name !== 'string') {
            throw boom('name es requerido y debe ser string', 400, 'VALIDATION_ERROR');
        }

        try {
            return await Category.update(id, { name: name.trim(), description });
        } catch (error) {
            if (e.code === 'ER_DUP_ENTRY') {
                throw boom('La categoría ya existe (name único)', 409, 'DUP_CATEGORY_NAME');
            }
            throw e;
        }
    },

    async remove(id) {
        const current = await Category.findById(id);
        if (!current) throw boom('Categoría no encontrada', 404, 'NOT_FOUND');

        try {
            await Category.remove(id);
        } catch (e) {
            if (e.code === 'ER_ROW_IS_REFERENCED_2') {
                throw boom('No se puede eliminar: tiene productos asociados', 409, 'CATEGORY_HAS_PRODUCTS');
            }   
            throw e;
        }
    }
}