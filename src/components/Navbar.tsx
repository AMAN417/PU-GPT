import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">


        {/* Logo */}
        <Link 
          to="/"
          className="text-3xl font-bold text-blue-500"
        >
          🎓 PU-GPT
        </Link>



        {/* Menu */}
        <ul className="hidden md:flex gap-8 text-gray-300">

          <li>
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
          </li>

          <li className="hover:text-blue-400 cursor-pointer">
            Admissions
          </li>

          <li className="hover:text-blue-400 cursor-pointer">
            Courses
          </li>

          <li className="hover:text-blue-400 cursor-pointer">
            Departments
          </li>

          <li className="hover:text-blue-400 cursor-pointer">
            Placements
          </li>

        </ul>




        {/* Buttons */}
        <div className="flex gap-3">


          <Link to="/login">

            <button
              className="
              px-5
              py-2
              rounded-lg
              border
              border-blue-500
              text-blue-400
              hover:bg-blue-500
              hover:text-white
              transition
              "
            >
              Login
            </button>

          </Link>



          <Link to="/signup">

            <button
              className="
              px-5
              py-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              transition
              "
            >
              Start Chat
            </button>

          </Link>


        </div>


      </div>

    </nav>
  );
}


export default Navbar;