const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')


const paymentCtrl = {
    getPayments: async(req, res) => {
        try{
            const payments = await Payments.find()
            res.json(payments)

        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createPayment: async(req,res) => {
        try{

            const  { _id,name, email, cart,phone, address} = req.body;
            const NewPayment = new Payments({
                user_id:_id,name, email, cart,phone, address
            })
            await NewPayment.save()
            res.json({msg:"Đặt hàng thành công"})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = paymentCtrl