import React from 'react'
import ToastContainer from './ToastContainer'
import LoadingBar from '../LoadingBar'

export default function ToastProvider({ children }) {
  return (
    <>
      <LoadingBar />
      {children}
      <ToastContainer />
    </>
  )
}
