// import React from 'react'
//import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';

import { Link, NavLink } from 'react-router-dom'
import { IoIosMoon } from 'react-icons/io'
import { HiOutlineBars3 } from 'react-icons/hi2'
import {AiOutlineClose} from 'react-icons/ai'
import { IoMdSunny } from 'react-icons/io';
import { useSelector } from 'react-redux';


const Navbar = () => {
  var [showNav,setShowNav]=useState(window.innerWidth <600 ? false : true)
  var [darkTheme, setDarkTheme]=useState(localStorage.getItem
    ('voting-app-theme') || "")
   
    var token=useSelector(state=>state?.vote?.currentVoter?.token)

    //var [darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') === 'dark')


  var closeNavMenu=()=>{
    if (window.innerWidth <600){
      setShowNav(false);
    }else{
      setShowNav(true)
    }
  }

 var changeThemeHandler=()=>{
  if(localStorage.getItem('voting-app-theme')=='dark'){
    localStorage.setItem('voting-app-theme','')
  }else{
    localStorage.setItem('voting-app-theme','dark')
  }
  setDarkTheme(localStorage.getItem('voting-app-theme'))
 }



 useEffect(()=>{
  document.body.className=localStorage.getItem('voting-app-theme');
 },[darkTheme])

  // if (darkTheme) {
  //     document.body.classList.add('dark');
  //   } else {
  //     document.body.classList.remove('dark');
  //   }
  // }, [darkTheme]);


  return (
   <nav>
    <div className='container nav_container'>
       <Link to="/" className='nav_logo'>Ibrahim</Link>
       <div>
       {token && showNav && <menu>
          <NavLink to='/elections' onClick={closeNavMenu}>Elections</NavLink>
          <NavLink to='/results' onClick={closeNavMenu}>Results</NavLink>
          <NavLink to='/logout' onClick={closeNavMenu}>Logout</NavLink>
        </menu>}
        <button className="theme_toggle-btn" onClick={changeThemeHandler}>{darkTheme ?<IoMdSunny/> :
        <IoIosMoon/>}</button>
        <button className="nav_toggle-btn" onClick={()=>
          setShowNav(!showNav)}>{showNav ?<AiOutlineClose/>:
          <HiOutlineBars3/>}</button>
       </div>
    </div>
   </nav>
  )
}

export default Navbar
