"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurantController_1 = require("../controllers/restaurantController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', restaurantController_1.getAllRestaurants);
router.get('/slug/:slug', restaurantController_1.getRestaurantBySlug);
router.get('/:id', restaurantController_1.getRestaurantById);
router.post('/', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.createRestaurant);
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.updateRestaurant);
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.deleteRestaurant);
router.post('/:id/menu', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.addMenuItem);
router.put('/:id/menu/:itemId', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.updateMenuItem);
router.delete('/:id/menu/:itemId', auth_1.authenticate, auth_1.requireAdmin, restaurantController_1.deleteMenuItem);
exports.default = router;
