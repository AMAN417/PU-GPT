import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login(){

  const navigate = useNavigate();


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState("");




  function handleLogin(){


    setError("");


    if(!email || !password){

      setError("Please fill all fields");

      return;

    }



    if(!email.includes("@")){

      setError("Enter a valid email");

      return;

    }



    if(password.length < 6){

      setError("Password must be at least 6 characters");

      return;

    }



    setLoading(true);



    setTimeout(()=>{


      localStorage.setItem(
        "pu-gpt-user",
        email
      );


      setLoading(false);


      navigate("/chat");


    },1000);



  }





return(

<div className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-slate-900
to-blue-950
flex
items-center
justify-center
px-6
">



<motion.div


initial={{
opacity:0,
y:40
}}


animate={{
opacity:1,
y:0
}}


className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-8
w-full
max-w-md
shadow-2xl
"


>



<h1 className="
text-4xl
font-bold
text-center
text-blue-500
mb-8
">

🎓 PU-GPT Login

</h1>




{
error &&

<p className="
text-red-400
text-center
mb-4
">

{error}

</p>

}




<input


value={email}


onChange={(e)=>setEmail(e.target.value)}


placeholder="Email address"


className="
w-full
bg-slate-800
border
border-slate-700
p-4
rounded-xl
mb-4
outline-none
text-white
focus:border-blue-500
"


/>





<input


value={password}


onChange={(e)=>setPassword(e.target.value)}


placeholder="Password"


type="password"


className="
w-full
bg-slate-800
border
border-slate-700
p-4
rounded-xl
mb-6
outline-none
text-white
focus:border-blue-500
"


/>





<button


onClick={handleLogin}


disabled={loading}


className="
w-full
bg-blue-600
hover:bg-blue-700
py-4
rounded-xl
font-semibold
transition
disabled:opacity-50
"


>


{

loading

?

"Logging in..."

:

"Login"

}


</button>



<p className="
text-center
text-gray-400
mt-6
">

New user?

<span

onClick={()=>navigate("/signup")}

className="
text-blue-400
cursor-pointer
ml-2
hover:underline
"

>

Create account

</span>


</p>




</motion.div>



</div>


);


}


export default Login;