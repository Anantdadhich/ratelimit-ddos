
import axios from 'axios'
import './App.css'
import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile';

function App() {
  const [token,settoken]=useState<string>();
   
  <Turnstile onSuccess={(token)=>{
    settoken(token)
  }} siteKey='0x4AAAAAAAfdZZQGlx3vUVvf' />
 
 
  return (
    <>
      <input type="text" placeholder='otp'  />
      <input type="text" placeholder='reset password' />

          <button onClick={()=>{
            axios.post("http://localhost:3000/reset-password",{
              email:"anil123@gmail.com",
              otp:"123456",
              token:token

            })
          }}>Update Password</button>
    </>
  )
}

export default App
