import React, { useEffect, useState } from 'react'
import './PurchaseHistory.css'

import all_product from '../Assetss/all_product'
const getDefaultCart = () =>{
  let cart ={};
  for(let index=0;index<30;index++){
      cart[index]=0;
  }
  return cart;
}
const PurchaseHistory = () => {
  const [allproducts,setAllproducts] = useState([])
  const [allCart,setCart] = useState(getDefaultCart())
  const fetchInfo = async()=>{
    await fetch('http://localhost:4000/allPurchaseHistory')
    .then((res)=>res.json())
    .then((data)=>{setAllproducts(data)});
  }
  // const fetchCart = async()=>{
  //   await fetch('http://localhost:4000/getcart')
  //   .then((res)=>res.json())
  //   .then((data)=>{setCart(data)});
  // }
  const fetchCartData = async()=>{
    //const authToken = localStorage.getItem('auth-token'); // Lấy mã token từ local storage

      fetch('http://localhost:4000/getcartData', {
          method: "POST",
          headers: {
              Accept: 'application/form-data',
              'Content-Type': 'application/json',

          },
          body: JSON.stringify(allproducts), // Không cần gửi dữ liệu nào khác cùng với yêu cầu
      })
      .then((response) => response.json())
      .then((data) => {
        setCart(data);
      });
  
  }
  useEffect(()=>{
    fetchInfo();
    fetchCartData();
    console.log(allCart)
    console.log(allproducts)
    
  },[])   // use square bracket to executed this function only once


  return (
    <div className='purchase'>
      <h1>Purchase History</h1>
      <div className='purchase-format-main'>
        <p>name</p>
        <p>Products</p>
        <p>Price</p>

      </div>
      <div className='purchase-allproducts'>
        <hr/>
        {allproducts.map((e,index)=>{   
                return(
                    <div>
                            <div className='purchase-format'>
                            <p>{e.nameUser}</p>
                            <p>{all_product.map((il)=>{
                                if(allCart[il.id]>0){
                                    return(
                                        <div>
                                            <p>{il.name}</p>
                                        </div>
                                    )
                                }
                            })}</p>
                            <p>${e.prices}</p>
                        
                            </div>
                        <hr/>
                    </div>
                )
            
            
        })}
      </div>
    </div>
  )
}

export default PurchaseHistory
