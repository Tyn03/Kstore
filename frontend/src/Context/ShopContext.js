import React, {createContext,useState,useEffect} from 'react'
import all_product from '../Components/Assets/all_product'
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe from @stripe/stripe-js
//import { useSelector } from 'react-redux';
export const ShopContext = createContext(null);

const getDefaultCart = () =>{
    let cart ={};
    for(let index=0;index<30;index++){
        cart[index]=0;
    }
    return cart;
}


const ShopContextProvider = (props) =>{
    //const[all_product,setAll_Product] = useState([]);
    const[cartItems,setCartItems] = useState(getDefaultCart());
    const[product,setProduct] = useState([]);
    // useEffect(()=>{
    //     fetch('http://localhost:4000/allproducts')
    //     .then((res)=>res.json())
    //     .then((data)=>setAll_Product(data))
    // },[])

    useEffect(() => {
    if (localStorage.getItem('auth-token')) {
        fetch('http://localhost:4000/getcart', {
            method: "POST",
            headers: {
                Accept: 'application/form-data',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            },
            body: "",
        })
        .then((response) => response.json())
        .then((data) => {
            setCartItems(data);
            setProduct(getCartProducts());
        });
    }
}, [])


    const getCartProducts = () => {
        const cartProducts = [];
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            const productId = parseInt(item);
            const product = all_product.find((product) => product.id === productId);
            if (product) {
              cartProducts.push({ ...product, quantity: cartItems[item] });
            }
          }
        }
        return cartProducts;
      };

    const addToCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        //console.log(cartItems);
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method : 'POST',
                headers : {
                    Accept : 'application/form-data',
                    'auth-token' : `${localStorage.getItem('auth-token')}`,
                    'Content-type' : 'application/json',
                },
                body : JSON.stringify({"itemId":itemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method : 'POST',
                headers : {
                    Accept : 'application/form-data',
                    'auth-token' : `${localStorage.getItem('auth-token')}`,
                    'Content-type' : 'application/json',
                },
                body : JSON.stringify({"itemId":itemId})
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    // const processToCheckout = () =>{
    //     fetch('http://localhost:4000/create-payment-intent',{
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             items : JSON.parse(localStorage.getItem('cartItems')),
    //         }), // Example: 10.00 USD
    //     })
    //     .then((res)=>res.json())
    //     .then((url)=>{
    //         window.location.href=url;
    //     })
    // }

    const stripePromise = loadStripe("pk_test_51P0qGnRppuYMcJ3lfPnc2f0BFahwwgSPliCKv2uCCVoBSTgplIYG8qiWUhLsRtrozaO0XRuMtF9AUpn4iXpAAGPf00WRjvUpTQ");

    const makePayment = async () => {
        const stripe = await stripePromise;
    
        const body = {
            products: product,
        }
        const headers = {
            "Content-Type": "application/json"
        }
        try {
            const response = await fetch("http://localhost:4000/create-checkout-session", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
    
            if (!response.ok) {
                throw new Error(`Failed to create checkout session: ${response.statusText}`);
            }
    
            const session = await response.json();
    
            if (!session || !session.id) {
                throw new Error(`Invalid session ID: ${session.id}`);
            }
    
            const result = stripe.redirectToCheckout({
                sessionId: session.id
            });
    
            if (result.error) {
                console.log(result.error);
            }
        } catch (error) {
            console.error('Error making payment:', error);
        }
    }
    

    const getTotalcartAmount =()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount+=itemInfo.new_price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems =()=>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue ={all_product,cartItems,addToCart,removeFromCart,getTotalcartAmount,getTotalCartItems,makePayment };
    
    
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider