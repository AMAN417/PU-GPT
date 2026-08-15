import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ChatPreview from "./components/ChatPreview";
import Stats from "./components/Stats";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <ChatPreview />
      <Stats />
      <Footer />
    </>
  );
}


function App() {

  return (
    <Routes>

      <Route 
        path="/" 
        element={<Home />}
      />


      <Route 
        path="/login" 
        element={<Login />}
      />


      <Route 
        path="/signup" 
        element={<Signup />}
      />


      <Route 
        path="/chat" 
        element={<Chat />}
      />


    </Routes>
  );

}


export default App;