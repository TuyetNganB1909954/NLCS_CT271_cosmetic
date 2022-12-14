const Products = require("../models/productModel")

//Filter, sorting and paginating
class APIfeatures{
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
    filtering(){
        const queryObj = {...this.queryString} // queryString = req.query
        console.log({before: queryObj})// before dalete page

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(e1 => delete(queryObj[e1]))
        console.log({after: queryObj})
        let queryStr = JSON.stringify({queryObj})
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        console.log({queryObj, queryStr})
        this.query.find(JSON.parse(queryStr))
        return this

    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('createAt')
        }
        return this
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 20
        const skip = (page-1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

const productCtrl = {
    getProduct: async (req,res) => {
        try{
           
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status: 'success',
                result: products.length,
                Products: products})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createProduct: async (req,res) => {
        try{
          const  {product_id, title, price, content, images, category} = req.body
            if(!images) return res.status(400).json({msg: "Không có hình ảnh"})

            const product = await Products.findOne({product_id})
            if(product) 
                return res.status(400).json({msg: "Sản phẫm đã tồn tại"})
            
            const newProduct = new Products({
                product_id, title, price, content, images, category
            })
            // res.json(newProduct)
            await newProduct.save()
            res.json({msg:"Thêm sản phẩm thành công"})

        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteProduct: async (req,res) => {
        try{
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Xoá sản phẩm thành công"})
        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateProduct: async (req,res) => {
        try{
            const  {product_id, title, price, content, images, category} = req.body 
            if(!images) return res.status(400).json({msg: "Không có hình ảnh"})

            await Products.findByIdAndUpdate({_id: req.params.id},{
                product_id, title, price, content, images, category
            })
            res.json({msg: "Cập nhật thành công"})

        }catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

}

module.exports = productCtrl