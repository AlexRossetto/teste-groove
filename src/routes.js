const { Router } = require('express');
const customerController = require('./controllers/customer');
const routes = Router();

routes.post('/customers', customerController.store);
routes.get('/customers/:id', customerController.show);
routes.put('/customers/:id', customerController.update); 

module.exports = routes;