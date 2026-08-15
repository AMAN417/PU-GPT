import { motion } from "framer-motion";


function Footer() {

  return (

    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6">

      <motion.div

        initial={{opacity:0, y:40}}
        whileInView={{opacity:1, y:0}}
        transition={{duration:0.6}}
        viewport={{once:true}}

        className="max-w-6xl mx-auto"

      >

        <div className="grid md:grid-cols-4 gap-8">


          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold text-blue-500">
              🎓 PU-GPT
            </h2>

            <p className="text-gray-400 mt-4">
              Your AI assistant for Punjabi University.
              Get answers, guidance and campus information instantly.
            </p>

          </div>



          {/* Product */}

          <div>

            <h3 className="text-white font-semibold mb-4">
              Product
            </h3>

            <ul className="text-gray-400 space-y-3">

              <li className="hover:text-blue-400 cursor-pointer">
                AI Chat
              </li>

              <li className="hover:text-blue-400 cursor-pointer">
                Features
              </li>

              <li className="hover:text-blue-400 cursor-pointer">
                Courses
              </li>

            </ul>

          </div>



          {/* University */}

          <div>

            <h3 className="text-white font-semibold mb-4">
              University
            </h3>

            <ul className="text-gray-400 space-y-3">

              <li className="hover:text-blue-400 cursor-pointer">
                Admissions
              </li>

              <li className="hover:text-blue-400 cursor-pointer">
                Departments
              </li>

              <li className="hover:text-blue-400 cursor-pointer">
                Placements
              </li>

            </ul>

          </div>



          {/* Contact */}

          <div>

            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <p className="text-gray-400">
              Email: support@pu-gpt.com
            </p>

            <p className="text-gray-400 mt-2">
              Patiala, Punjab 🇮🇳
            </p>


          </div>


        </div>



        <div className="
          border-t
          border-slate-800
          mt-10
          pt-6
          text-center
          text-gray-500
        ">

          © 2026 PU-GPT. All rights reserved.

        </div>


      </motion.div>


    </footer>

  );

}


export default Footer;