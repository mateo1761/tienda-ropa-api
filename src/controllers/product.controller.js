const ProductService = require('../services/product.service');

const respond = (res, status, message, data = null) => res.status(status).json({ success: true, status, message, data });

module.exports = {
    async index(req, res) {
        try {
            const data = await ProductService.list({ category_id: req.query.category_id });
            return respond(res, 200, 'Productos listados exitosamente', data);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async show(req, res) {
        try {
            const item = await ProductService.get(req.params.id);
            return respond(res, 200, 'Producto obtenido exitosamente', item);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async store(req, res) {
        try {
            const created = await ProductService.create(req.body);
            return respond(res, 201, `Producto "${created.name}" creado exitosamente`, created);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async update(req, res) {
        try {
            const updated = await ProductService.update(req.params.id, req.body);
            return respond(res, 200, `Producto "${updated.name}" actualizado exitosamente`, updated);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    },

    async destroy(req, res) {
        try {
            await ProductService.remove(req.params.id);
            return respond(res, 200, 'Producto eliminado exitosamente', null);
        } catch (error) {
            return res
                .status(error.status || 500)
                .json({ success: false, status: e.status || 500, code: e.code || 'INTERNAL', message: e.message });
        }
    }
};