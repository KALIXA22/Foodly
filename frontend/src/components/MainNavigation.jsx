import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
function MainNavigation() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/> 
    </>
    
  )
}

export default MainNavigation;