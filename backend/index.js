const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());


// mongodb+srv://khang:<password>@cluster0.0qauyhg.mongodb.net/

// Database Connection with Mongodb
mongoose.connect("mongodb+srv://khang:khang1234@cluster0.0qauyhg.mongodb.net/e-commerce")

// API Creation
app.get("/",(req,res)=>{
    res.send("lon")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination : './upload/images',
    filename : (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

app.use('/images',express.static('upload/images'))
// Creating Upload Endpoint for images
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success : 1,
        image_url : `http://localhost:4000/images/${req.file.filename}`
    })
    
})

// schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type : Number,
        required : true,
    },
    name:{
        type : String,
        required : true,
    },
     image:{
         type : String,
        
     },
    category:{
        type : String,
        required : true,
    },
    new_price:{
        type : Number,
        required : true,
    },
    old_price:{
        type : Number,
        required : true,
    },
    date:{
        type : Date,
        default : Date.now,
    },
    available:{
        type : Boolean,
        default : true,
    },
})

// add a product in database
app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id+1;
        console.log('ko');
    }else{
        id=1;
        console.log('ok');
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    await product.save()
    console.log(product);
    res.send({success : true, message : "hi"})

})

// Creating API for deleting Products

app.delete('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success : 1,
        name :  req.body.name
    })
})

// Creating API for getting all products

app.get('/allproducts', async(req,res)=>{
    let products = await Product.find({});
    res.send(products);
})
app.listen(4000,()=>console.log("hihi"))  

