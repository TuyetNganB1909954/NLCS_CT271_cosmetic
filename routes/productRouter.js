const ProductCtrl = require("../controllers/productCtrl")
const router = require("express").Router();

const auth = require("../middleware/Auth")
const authAdmin = require("../middleware/AuthAdmin");
const { route } = require("./userRouter");

router.route('/product')
    .get(ProductCtrl.getProduct)
    .post(auth, authAdmin, ProductCtrl.createProduct)

router.route('/product/:id')
    .delete(auth, authAdmin, ProductCtrl.deleteProduct)
    .put(auth, authAdmin, ProductCtrl.updateProduct)

module.exports = router