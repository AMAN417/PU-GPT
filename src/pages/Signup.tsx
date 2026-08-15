import { motion } from "framer-motion";

function Signup(){

return(

<div className="
min-h-screen
bg-slate-950
flex
items-center
justify-center
px-6
">


<motion.div

initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}

className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-8
w-full
max-w-md
"

>


<h1 className="
text-3xl
font-bold
text-blue-500
text-center
mb-8
">

🎓 Create Account

</h1>


<input
className="
w-full
bg-slate-800
p-3
rounded-xl
mb-4
text-white
"
placeholder="Full Name"
/>


<input
className="
w-full
bg-slate-800
p-3
rounded-xl
mb-4
text-white
"
placeholder="Email"
/>


<input
className="
w-full
bg-slate-800
p-3
rounded-xl
mb-6
text-white
"
placeholder="Password"
type="password"
/>



<button className="
w-full
bg-blue-600
py-3
rounded-xl
hover:bg-blue-700
">

Create Account

</button>


</motion.div>


</div>

);

}


export default Signup;