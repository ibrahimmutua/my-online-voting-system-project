import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Image from '../assets/403.jfif'
const ErrorPage = () => {
var navigate=useNavigate()


  useEffect(()=>{
    setTimeout(()=>{
      navigate(-1)
    },8000)
  })


  return (
    <section className='errorpage'>
    <div className='errorPage_container'>
      <img src={Image} alt="Page not found"/>
      <h1>404</h1>
      <p>This page does not exist.You will be redirected to the previous page</p>
    </div>
    </section>
  )
}

export default ErrorPage
