const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser =  require("cookie-parser");
const fileupload = require("express-fileupload");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileupload({
    useTempFiles: true
}));

// Kết nối với mongodb

const URI = process.env.MONGODB_URL;
async function connect(){
    try{
        await mongoose.connect(URI);
        console.log("Kết nối thành công đến MongoDB");
    }catch(error){
        console.error(error);
    }
}
connect();


//Router
app.use('/user', require("./routes/userRouter"))
app.use('/api', require("./routes/categoryRouter"))
app.use('/api', require("./routes/productRouter"))
app.use('/api', require("./routes/upload"))
app.use('/api', require("./routes/paymentRouter"))



const PORT = process.env.port;
app.listen(PORT,()=>{
    console.log(`Server chaỵ trên port ${PORT}`)
})