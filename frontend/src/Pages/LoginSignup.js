import React from 'react'
import './CSS/loginSignup.css'
const LoginSignup = () =>{
    return (
        <div className='loginsignup'>
            <div className='loginsignup-container'>
                <h1>Sign Up</h1>
                <div className='loginsignup-fields'>
                    <input type="text" placeholder='your name'/>
                    <input type="email" placeholder='your address'/>
                    <input type="password" placeholder='your password'/>
                </div>
                <button>Continue</button>
                <p className='loginsignup-login'>Already have an account ? <span>Login here</span></p>
                <div className='loginsignup-agree'>
                    <input type="checkbox" name='' id=''/>
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup