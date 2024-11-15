'use client';
import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/app/components/Navbar'
import FiltredCountry from '@/app/components/FiltredCountry'
function pages() {
  return (
    <div>
      <Navbar/>
      <FiltredCountry/>
    </div>
  )
}

export default pages