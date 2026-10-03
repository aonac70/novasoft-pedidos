const { Router } = require('express');
const controlador = require('../controllers/pedidos.controller');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);
router.post('/', controlador.crear);

module.exports = router;
