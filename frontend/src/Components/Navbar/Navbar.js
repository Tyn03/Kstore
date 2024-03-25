import React, { useCallback, useContext, useState,useRef } from "react";
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import {Link} from 'react-router-dom';
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from '../Assets/dropdown_icon.png';
const Navbar = () =>{
    const [menu,setMenu] = useState("shop")
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle =(e)=>{
        menuRef.current.classList.toggle('nav-menu-visible')
        e.targer.classList.toggle('open');
    }
    return (
        <div className="Navbar">
            <div className="nav-logo">
                <img src={logo} alt=""/>
                <p>SHOPPER</p>
            </div>
            <img className="nav-dropdown" onClick ={dropdown_toggle} src={nav_dropdown} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link  style={{textDecoration : 'none'}} to='/'>Shop </Link>{menu==="shop" ? <hr/> :<></>} </li>
                <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration : 'none'}} to='/mens'>men </Link> {menu==="mens" ? <hr/> :<></>}</li>
                <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration : 'none'}} to='/women'>Women </Link> {menu==="women" ? <hr/> :<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration : 'none'}} to='/kids'>Kids </Link> {menu==="kids" ? <hr/> :<></>}</li>
            </ul>
            <div className="nav-login-cart">
                <button><Link style={{textDecoration : 'none'}} to='/login'>Login </Link></button>
                <Link style={{textDecoration : 'none'}} to='/cart'><img src={cart_icon} alt=""/></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar