import { motion } from "framer-motion";

function Features() {
  const features = [
    {
      title: "🎓 University Assistant",
      text: "Get instant answers about Punjabi University admissions, courses and departments."
    },
    {
      title: "📚 Smart Learning",
      text: "Ask AI about notes, syllabus, exams and study material."
    },
    {
      title: "💼 Career Guidance",
      text: "Explore placements, internships and career opportunities."
    },
    {
      title: "🏫 Campus Information",
      text: "Find hostel, library, events and campus details easily."
    }
  ];

  return (
    <section className="bg-slate-950 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12">
          Everything you need in one
          <span className="text-blue-500"> AI Assistant</span>
        </h2>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15
              }}
              viewport={{ once: true }}

              className="
              bg-slate-900/70
              border border-slate-800
              rounded-2xl
              p-6
              hover:border-blue-500
              hover:-translate-y-2
              transition
              "
            >

              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-400">
                {item.text}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;