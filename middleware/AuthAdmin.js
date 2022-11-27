const User = require("../models/userModel")

const AuthAdmin = async (req, res, next) => {
    try{
        // Lấy thông tin tu id
        const user = await User.findOne({
            _id: req.user.id
        })
        if (user.role === 0)
            return res.status(400).json({msg: "Admin bị từ chối truy cập vào tài nguyên"})
        next()
    }catch (error) {
        return res.status(500).json({msg: error.message})
    }
}
module.exports = AuthAdmin