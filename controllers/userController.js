const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const { use } = require("../routes/userRouter");



const userCtrl = {
    register:async (req,res) => {
        try{
            const { name, email, password } = req.body;
            if(!name || !email || !password)
                return res.status(400).json({msg: "Vui lòng điền đày đủ thông tin"})
          

            const user = await Users.findOne({email});

            if(user)
                return res.status(400).json({msg: "Email đã tồn tại"})
        
            if(password.length < 6)
                return res.status(400).json({msg: "Mật tối thiểu 6 ký tự"});
            // Mã hóa mật khẩu
            const passwordHash = await bcrypt.hash(password,10);

            // const newUser = new Users({
            //         name, email, password: passwordHash
            // })
            const newUser = new Users({
                name, email, password: passwordHash
            })
        
            //    // Lưu vào mongodb
               await newUser.save()

            //    // Tạo một jsonwebtoken để xác thực
               const accesstoken = createAccessToken({id: newUser._id})
               const refreshtoken = createRefreshToken({id: newUser._id})
               res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    
                })
               res.json({accesstoken})

              
        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    login: async (req,res) => {
        const { email, password} = req.body

        const user = await Users.findOne({email})
        if(!user)
            return res.status(400).json({msg: "Người dùng không tồn tại"})
        
        // Kiểm tra pasword
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) 
            return res.status(400).json({msg: "Mật khẩu không đúng"})
        const accesstoken = createAccessToken({id: user._id})
        const refreshtoken = createRefreshToken({id: user._id})
        res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
        })
 

        res.json({accesstoken})
    },
    logout: async (req,res) => {
        try{
            res.clearCookie('refreshtoken',{ path: '/user/refresh_token'} )
            return res.json({msg: "Đã đăng xuất"})
        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    refreshtoken: (req, res) => {
        try{
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token)
                return res.status(400).json({msg: "Bạn chưa đăng nhập hoặc đăng kí"})
            jwt.verify(rf_token, process.env.REFRESH_TOOKEN_SECRET, (error, user) => {
                if(error) return res.status(400).json({msg: "Bạn chưa đăng nhập hoặc đăng kí"})
                
                const accesstoken = createAccessToken({id: user.id})
               
                res.json({accesstoken})
            })
        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req,res) => {
        try{
            const user = await Users.findById(req.user.id)
            if(!user )
                return res.status(400).json({msg: "Người dùng không tồn tại"})
            res.json(user)
        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    },
    addCart: async (req, res) => {
        try{
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "Người dùng không tồn tại"})
            await Users.findByIdAndUpdate({_id: req.user.id},{
                cart: req.body.cart
            })
            return res.json({msg: "Thêm vào giỏ hàng"})
        }catch(error){
            return res.status(500).json({msg: error.message})
        }
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOOKEN_SECRET , {expiresIn: '1d'})
};
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOOKEN_SECRET , {expiresIn: '1d'})
};
module.exports = userCtrl;