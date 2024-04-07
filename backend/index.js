//import dotenv from 'dotenv'
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

//const all_product = require('Assets/all_product');
// Import the all_product file
//const allProductData = require('./Assets/all_product');




app.use(express.json());
app.use(cors());

dotenv.config();

 // Stripe


 const stripe = require('stripe')('sk_test_51P0qGnRppuYMcJ3lxjm2KXy4YhKBUxW8aNETZdRv5oMPL1OYPCWBYWFkuLbQJScCy1ZM5elsJsGIGx1UFwKW9oD100Xei7cumd');
 const DOMAIN = 'http://localhost:3000';


//  app.post('/create-payment-intent', async (req, res) => {
//     const {products} = req.body;
//     const lineItems = products.map((product)=>({
//         price_data:{
//             currency:"usd",
//             product_data:{
//                 name : product.name,
//                 images : [product.image]
//             },
//             unit_amount : Math.round(product.price*100),
//         },
//         quantity : product.quantity
//     }));

//     const session = await stripeGateway.checkout.session.create({
//         payment_method_type : ["card"],
//         mode :  "payment",
//         success_url : "${DOMAIN}/success",
//         cancel_url : "${DOMAIN}/cancel",
//         line_items : lineItems,
//         billing_address_collection : "required",
//     });
//     res.json(session.url);
// });



// app.post("/api/create-checkout-session", async (req, res) => {
//     const { products } = req.body;
//     console.log(products)
//     const lineItems = Object.entries(products).map(([id, quantity]) => {
//         const product = allProductData.find(item => item.id === Number(id));
//         console.log(product)
//         return {
//             price_data: {
//                 currency: "inr",
//                 product_data: {
//                     name: product.name,
//                     images: [product.image]
//                 },
//                 unit_amount: product.new_price * 100,
//             },
//             quantity: quantity
//         };
//     });

//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: lineItems,
//             mode: "payment",
//             success_url: "http://localhost:3000/success",
//             cancel_url: "http://localhost:3000/cancel",
//         });

//         res.json({ id: session.id });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



app.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body;
     console.log(products)
     const lineItems = Object.keys(products).map((id) => {
        const product = products[id];
         return {
             price_data: {
                 currency: "usd",
                 product_data: {
                     name: product.name,
                 },
                 unit_amount: product.new_price * 100,
             },
             quantity: products[id]
         };
     });

     try {
         const session = await stripe.checkout.sessions.create({
             payment_method_types: ["card"],
             line_items: lineItems,
             mode: "payment",
             success_url: "http://localhost:3000/success",
             cancel_url: "http://localhost:3000/cancel",
         });

         res.json({ id: session.id });
     } catch (error) {
         res.status(500).json({ error: error.message });
     }
 });
  



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


//schema creating for user model

const Users = mongoose.model('Users',{
    name:{
        type : String,
    },
    email:{
        type : String,
        unique : true,
    },
    password:{
        type : String,
    },
    cartData : {
        type : Object,
    },
    date : {
        type : Date,
        default : Date.now,
    }
})

// Creating Endpoint for registring the user

app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({
            success : false,
            error : "Exixting user found with this email"
        })
    }
    let cart = {};
    for(let i=0;i<30;i++){
        cart[i] = 0;
    }
    const user = new Users({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        cartData : cart,

    })

    await user.save();

    const data = {
        user : {
            id : user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom')
    res.json({
        success : true,
        token
    })
})

// Creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user : {
                    id : user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({
                success : true,
                token
            });
        }
        else{
            res.json({
                success : false,
                error:"Wrong Password"
            });
        }
    }
    else{
        res.json({
            success : false,
            error:"Wrong email Id"
        });
    }

})

// Creating endpoint for new collection data

// app.get('/newcollection',async(req,res)=>{
//     let products = await Product.find({});
//     let newcollection = products.slice(1).slice(-8);
//     res.send(newcollection)
// })



// Creating middleware to fetch user

const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    //console.log(token)
    if(!token){
        res.status(401).send({error : "Please authentication using valid token pls"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({error : "Please authentication using valid token cak"});
        }
    }
}







// Creating endpoint for adding products in cart 


app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log(req.body,req.user);

    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})

// Creating endpoint for removing products in cart 


app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log(req.body,req.user);

    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Delete");
    }
})

// Creating endpoint to get cartData

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);

    
})




// advance
const purchaseHistory = mongoose.model('Purchase',{
    nameUser:{
        type : String,
    },
    nameProduct:{
        type : String,
    },
    
    prices : {
        type : Number,
    },
    cartData : {
        type : Object,
    },
    date : {
        type : Date,
        default : Date.now,
    }
})

app.post('/purchase',async(req,res)=>{
    
    const purchase = new purchaseHistory({
        nameUser : req.body.username,
        prices : req.body.prices,
        cartData : req.body.cartData,

    })
    await purchase.save();
})


app.get('/allPurchaseHistory', async(req,res)=>{
    let history = await purchaseHistory.find({});
    //console.log(history)
    res.send(history);
})
app.post('/getcartData', async (req, res) => {
    console.log("GetCart");
    //console.log(req.body);
    
    try {
        const userData = await purchaseHistory.findOne({ nameUser: req.body.username });
        if (userData) {
            console.log("lon");
            res.json(userData.cartData);
            console.log(userData.cartData);
        } else {
            console.log("User data not found");
            res.status(404).json({ error: 'User data not found' });
        }
    } catch (error) {
        console.error('Error fetching cart data:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(4000,()=>console.log("hihi"))  

