const CategoryService = require('../services/category.service');

const respond = (res, status, message, data = null) => res.status(status).json({ success: true, status, message, data });

module.exports = {
    async index(_req, res) {
        try {
            const items = await CategoryService.list();
            return respond(res, 200, 'Categorias listadas exitosamente', items)
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async show(req, res) {
        try {
            const item = await CategoryService.get(req.params.id);
            return respond(res, 200, 'Categoría obtenida exitosamente', item);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async store(req, res) {
        try {
            const created = await CategoryService.create(req.body);
            return respond(res, 200, `Categoría "${created.name}" creada exitosamente`, created);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await CategoryService.update(req.params.id, req.body);
            return respond(res, 200, `Categoría "${updated.name}" actualizada exitosamente`, updated);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async destroy(req, res) {
        try {
            await CategoryService.remove(req.params.id);
            return respond(res, 200, 'Categoría eliminada exitosamente', null);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    }
};