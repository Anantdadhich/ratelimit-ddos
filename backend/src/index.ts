import express from "express";
import rateLimit from "express-rate-limit";
const SECERETKEY='0x4AAAAAAAfdZeyWJ0N_9SLZNwcy-OZpvL8';
const app=express();

app.use(express.json());

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});




const otpScore:{[key:string]:string}={};  //memory store to store the emails for otp generate 
const optexpiry=5*60*1000;  //for more security to expire otp after five minutes
app.post('/generate-otp',otpLimiter,(req,res)=>{
    //not extract from cookie 
    const email=req.body.email;
    
     if(!email){
        return res.status(400).json({message:"email is required"})
      }
    
    const otp=Math.floor(100000+Math.random()*900000).toString();
    otpScore[email]=otp;

    console.log(`otp for ${email}:${otp}`)
    res.status(200).json({message:"otp generate and logged"})
})

app.post("/reset-password",async(req,res)=>{
    const {email,otp,newpass,token}=req.body;
      
      let formdata=new FormData();
      formdata.append('secret',SECERETKEY);
      formdata.append('response',token);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

      const result=await fetch(url,{
        body:formdata,
        method:'POST'
      })

      const challengeSucc=(await result.json()).success;
      if(!challengeSucc){
        return res.status(403).json({mess:"invlalid captcha"})
      }
    if(!email || !newpass || !otp){
      return  res.status(400).json({message:"give the credentials"})
    }

    if(Number(otpScore[email])===Number(otp)){
        console.log(`password for ${email} is rest to ${newpass}`)
        delete otpScore[email];
        res.status(200).json({message:"password reset "})
    }else{
        res.status(400).json({mess:"not reset"})
    }


})

app.listen(3000);





