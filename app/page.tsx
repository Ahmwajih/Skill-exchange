"use client";
import Login from "@/app/components/Login";
import "./globals.css";
import Headers from "./components/Headers";
import Faq from "@/app/components/Faq";
import SkillList from "@/app/components/SkillList";
import Footer from "@/app/components/Footer"
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {
  return (
    <div>
      <Headers />
      <Login />
      <Faq />
      <SkillList />
      <Footer/>
    </div>
  );
}
