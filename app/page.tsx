import Login from "@/app/components/Login";
import './globals.css';
import Headers from "./components/Headers";

export default function Home() {
  return (

    <div>
      <Headers />
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Welcome to our community where we exchange skills</h1>
      <Login />
    </div>
    </div>

  );
}