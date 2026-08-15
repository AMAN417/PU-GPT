import { motion } from "framer-motion";


function Stats() {

  const stats = [
    {
      number: "50,000+",
      title: "Students"
    },
    {
      number: "50+",
      title: "Departments"
    },
    {
      number: "200+",
      title: "Courses"
    },
    {
      number: "1M+",
      title: "AI Queries"
    }
  ];


  return (

    <section className="bg-slate-950 py-20 px-6">

      <div className="max-w-6xl mx-auto">


        <motion.h2

          initial={{opacity:0, y:30}}
          whileInView={{opacity:1, y:0}}
          transition={{duration:0.6}}
          viewport={{once:true}}

          className="text-4xl font-bold text-center mb-12"
        >

          Trusted by the

          <span className="text-blue-500">
            {" "}University Community
          </span>

        </motion.h2>



        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">


          {stats.map((item,index)=>(


            <motion.div

              key={index}

              initial={{opacity:0, y:50}}

              whileInView={{opacity:1, y:0}}

              transition={{
                duration:0.5,
                delay:index * 0.15
              }}

              viewport={{once:true}}

              whileHover={{
                scale:1.05
              }}


              className="
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-8
              text-center
              hover:border-blue-500
              transition
              "

            >


              <h3 className="
              text-4xl
              font-bold
              text-blue-500
              ">

                {item.number}

              </h3>



              <p className="
              text-gray-400
              mt-3
              ">

                {item.title}

              </p>



            </motion.div>


          ))}


        </div>


      </div>


    </section>

  );
}


export default Stats;