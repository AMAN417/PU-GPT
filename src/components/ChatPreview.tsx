import { motion } from "framer-motion";

function ChatPreview() {
  return (
    <section className="bg-slate-950 py-24 px-6">

      <div className="max-w-5xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Experience
          <span className="text-blue-500"> PU-GPT </span>
          in Action
        </motion.h2>


        {/* Chat Box */}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}

          className="
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-3xl
          shadow-2xl
          p-6
          max-w-3xl
          mx-auto
          hover:shadow-blue-500/20
          transition
          "
        >


          {/* User Message */}

          <motion.div
            initial={{ opacity:0, x:50 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ delay:0.3 }}
            className="flex justify-end mb-5"
          >

            <div className="
              bg-blue-600
              px-5
              py-3
              rounded-2xl
              max-w-md
              text-white
            ">
              What are the admission requirements for Punjabi University?
            </div>

          </motion.div>



          {/* AI Message */}

          <motion.div
            initial={{ opacity:0, x:-50 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ delay:0.5 }}
            className="flex justify-start"
          >

            <div className="
              bg-slate-800
              px-5
              py-3
              rounded-2xl
              max-w-md
              text-gray-200
            ">
              PU-GPT: You can check eligibility,
              required documents, fees and important dates here.
            </div>

          </motion.div>



          {/* Input Area */}

          <motion.div
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            transition={{ delay:0.7 }}

            className="
            mt-8
            flex
            items-center
            bg-slate-800
            rounded-xl
            px-4
            py-3
            "
          >

            <input

              className="
              bg-transparent
              outline-none
              flex-1
              text-gray-300
              "

              placeholder="Ask PU-GPT anything..."
            />


            <button

              className="
              bg-blue-600
              px-5
              py-2
              rounded-lg
              hover:bg-blue-700
              transition
              "
            >

              Send

            </button>


          </motion.div>


        </motion.div>


      </div>


    </section>
  );
}

export default ChatPreview;