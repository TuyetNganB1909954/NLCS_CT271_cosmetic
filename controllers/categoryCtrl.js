const Category = require("../models/categoryModel")

const categoryCtrl = {
    getCategory: async (req,res) => {
        try{
            const categories = await Category.find()
              res.json(categories)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createCategory: async (req,res) => {
        try{
            // if role = 2 ---> admin
            // admin cos quyền thêm , sửa, xóa 
            const {name} = req.body;
            const category = await Category.findOne({name})
            if(category) 
                return res.status(400).json({msg: "Sản phẩm đã tồn tại"})

            const newCategory = new Category({name})
            await newCategory.save()

            res.json({msg: "Thêm sản phẩm thành công"})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async (req,res) => {
        try{
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "xoa thanh cong"})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }, 
    updateCategory: async (req,res) => {
        try{
            const {name} = req.body
            await Category.findByIdAndUpdate({_id:req.params.id}, {name})
            res.json({msg: "Cap nhat thanh cong"})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    } 
}
module.exports = categoryCtrl