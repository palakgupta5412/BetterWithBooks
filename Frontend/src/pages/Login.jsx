import React from 'react'
import Button from '../components/Button'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Login = () => {

    const [state , setState] = React.useState("login");
    const [passwordVisible , setPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(state === "login"){
            setState("register");
        } else {
            setState("login");
        }

    }
  return (
    <div className='w-full h-screen relative flex justify-center gap-1 items-center p-20 px-44'>
        <img src='/login.jpg' alt='Login Coming Soon' className='w-full h-full object-cover opacity-100 blur-sm inset-0 bg-black/70 absolute'/>

        <div className={`bg-black/50 w-1/2 h-full flex flex-col justify-center items-center gap-8 p-10 ${state === "register" ? "transform translate-x-full transition-all ease-in-out" : "transition-all ease-in-out transform translate-x-0" }`}>
            <h1 className='font-gravitas text-white'>{state === "register" ? "Register" : "Login"}</h1>
            <form className='w-full flex flex-col gap-6'>
                <input type="text" placeholder='Name' className={`w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white ${state === "login" ? "hidden" : "visible"}`}/>
                <input type="email" placeholder='Email' className='w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white '/>
                <div className='w-full flex justify-between items-center gap-2 border border-white/50 pr-4'>    
                    <input type={passwordVisible ? "text" : "password"}  placeholder='Password' className='w-full p-3 outline-none bg-transparent  text-white placeholder-white '/>
                    {passwordVisible ?
                        <FaRegEye size={20} className='cursor-pointer text-white/70' onClick={togglePasswordVisibility} />
                        :
                        <FaRegEyeSlash size={22} className='cursor-pointer text-white/70' onClick={togglePasswordVisibility} />
                    }
                </div>
                {/* <button type='submit' className='w-full bg-[#ffba66] text-black font-bold p-3 hover:bg-[#dda200] transition-colors'>Login</button> */}
                <Button onClick={handleSubmit} text={state === "register" ? "Register" : "Login"} className="bg-[#ffba66] text-black font-bold p-3 hover:bg-[#dda200] transition-colors w-full" />
            </form>
        </div>
        <div className={`p-10  flex flex-col gap-8 justify-center items-center bg-[linear-gradient(to_bottom,#d4b06b,#ffffff,#d4b06b)] w-1/2 h-full ${state === "register" ? "transform -translate-x-full transition-all ease-in-out" : "transition-all ease-in-out transform translate-x-0"}`}>
            <h2 className='text-xl font-bold font-gravitas mb-4 '>{ state === "register" ?  "Already have an account?" : "No Account? Create one."  }</h2>
            <h3 className='text-xl font-bold text-center w-full font-playfair'>{state === "register" ? "Become a part of <br/> your own story." : "Let's dive into your world of books."}</h3>
            <h4>{state === "register" ? "Sign up and start curating your book universe." : "Log in and start your reading journey."}</h4>
            <Button onClick={handleSubmit} text={state === "register" ? "Login" : "Register"} className="bg-black text-white font-bold p-3 hover:bg-gray-800 transition-colors mt-4 w-1/2" />
        </div>
    </div>
  )
}

export default Login