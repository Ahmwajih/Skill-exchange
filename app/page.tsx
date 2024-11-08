import Login from "@/app/components/Login";
import './globals.css';
import Headers from "./components/Headers";
import Faq from "@/app/components/Faq";

export default function Home() {
  return (

    <div>
      <Headers />
      <Login />
      <Faq/>
    </div>

  );
}