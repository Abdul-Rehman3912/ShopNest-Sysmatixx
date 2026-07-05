const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protectRoute } = require('../middlewares/auth.middleware');
const { admin } = require('../middlewares/admin.middleware');

const router = express.Router();

router.route('/').post(protectRoute, addOrderItems).get( getOrders);
router.route('/myorders').get(protectRoute, getMyOrders);
router.route('/:id/status').put(protectRoute, admin, updateOrderStatus);

module.exports = router;