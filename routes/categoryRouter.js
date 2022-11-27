const categoryCtrl = require("../controllers/categoryCtrl")
const router = require("express").Router();

const auth = require("../middleware/Auth")
const authAdmin = require("../middleware/AuthAdmin");
const { route } = require("./userRouter");

router.route('/category')
    .get(categoryCtrl.getCategory)
    .post(auth, authAdmin, categoryCtrl.createCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCategory)
    .put(auth, authAdmin, categoryCtrl.updateCategory)

module.exports = router