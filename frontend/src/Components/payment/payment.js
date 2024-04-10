import React, { useContext, useEffect, useState } from 'react'
import './payment.css';
import { ShopContext } from '../../Context/ShopContext'
const Payment = () => {

  //console.log(prices)
  const {all_product,cartItems,addToCart,removeFromCart,getTotalcartAmount,makePayment} = useContext(ShopContext);

  const [formData, setFormData] = useState({
    username: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    prices : getTotalcartAmount(),
    cartData : cartItems,
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to make payment');
      }
      // Xử lý response nếu cần
    } catch (error) {
      console.error('Error making payment:', error);
    }
  }
  

  return (
    <div className="payment-container">
      <h2>Infromation payment</h2>
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name:</label>
          <input value={formData.username} onChange={changeHandler} type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Number of Cart:</label>
          <input value={formData.cardNumber} onChange={changeHandler} type="text" id="cardNumber" name="cardNumber" required />
        </div>
        <div className="form-group">
          <label htmlFor="expiry">Expire:</label>
          <input value={formData.expiry} onChange={changeHandler} type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
        </div>
        <div className="form-group">
          <label htmlFor="cvc">CVV:</label>
          <input value={formData.cvc} onChange={changeHandler} type="text" id="cvc" name="cvc" required />
        </div>
        
        <div>{getTotalcartAmount()}</div>
        <button type="submit">Pay</button>
      </form>
    </div>
  );
}

export default Payment;
