const router = require("express").Router()
const userCtcl = require("../controllers/userController")
const auth = require("../middleware/Auth")

router.post('/register', userCtcl.register)
router.post('/login', userCtcl.login)
router.get('/logout', userCtcl.logout)
router.get('/refresh_token', userCtcl.refreshtoken)
router.get('/infor', auth, userCtcl.getUser)
router.patch('/addcart', auth, userCtcl.addCart)
module.exports = router;