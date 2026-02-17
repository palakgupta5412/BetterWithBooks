import React, { useState } from 'react';
import Button from '../components/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth.service'; 
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {

    const { addToast } = useToast(); // Use the hook
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const [mode, setMode] = useState("login");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const toggleMode = (e) => {
        if(e) e.preventDefault();
        setMode(mode === "login" ? "register" : "login");
        setError("");
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let response;
            
            if (mode === "login") {
                response = await loginUser({ 
                    email: formData.email, 
                    password: formData.password 
                });
            } else {
                response = await registerUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            }

            console.log("FULL API RESPONSE:", response);

            // Robust data extraction
            const backendResponse = response?.data || response; // Handle different axios structures
            const userRes = backendResponse?.data?.user || backendResponse?.user || backendResponse;

            console.log("EXTRACTED USER:", userRes);

            if (userRes && (userRes._id || userRes.email)) {
                // 1. Update Auth Context
                login(userRes);
                
                // --- 🔴 FIXED THIS SECTION 🔴 ---
                // Old (Crashing): addToast({ type: "success", message: "..." })
                // New (Working): addToast(message, type)
                addToast(
                    `Successfully ${mode === "login" ? "logged in" : "registered"}.`, 
                    "success"
                );
                // --------------------------------

                navigate("/");
                
            } else {
                // --- 🔴 FIXED ERROR TOAST TOO 🔴 ---
                addToast(
                    `Failed to ${mode === "login" ? "log in" : "register"}.`,
                    "error"
                );
                console.error("User data not found in response.");
                setError("Login successful, but received invalid user data.");
            }

        } catch (err) {
            console.error("Auth Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Connection failed.";
            setError(errorMessage);
            
            // --- 🔴 FIXED CATCH BLOCK TOAST 🔴 ---
            addToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen relative flex flex-col md:flex-row justify-center items-center p-4 md:p-20 md:px-44 overflow-hidden'>
            <img src='/login.jpg' alt='Background' className='w-full h-full object-cover opacity-100 blur-sm inset-0 bg-black/70 absolute z-0' />

            {/* Error Banner inside Form */}
            {error && (
                <div className="absolute top-10 z-50 bg-red-600 text-white px-6 py-2 rounded shadow-lg animate-bounce">
                    {error}
                </div>
            )}

            <div className={`
                bg-black/60 backdrop-blur-md z-10 
                w-full md:w-1/2 h-auto md:h-full 
                flex flex-col justify-center items-center gap-8 p-8 md:p-10 
                rounded-2xl md:rounded-none 
                transition-all duration-700 ease-in-out transform 
                ${mode === "register" ? "md:translate-x-full" : "md:translate-x-0"}
            `}>
                <h1 className='font-gravitas text-white text-3xl md:text-4xl'>
                    {mode === "register" ? "Register" : "Login"}
                </h1>
                
                <form className='w-full flex flex-col gap-6' onSubmit={handleAuth}>
                    {mode === "register" && (
                        <input 
                            type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Name' 
                            className={`w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white transition-all`}
                        />
                    )}

                    <input 
                        type="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email' required
                        className='w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white'
                    />

                    <div className='w-full flex justify-between items-center gap-2 border border-white/50 pr-4'>    
                        <input 
                            type={passwordVisible ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder='Password' required
                            className='w-full p-3 outline-none bg-transparent text-white placeholder-white'
                        />
                        <div onClick={() => setPasswordVisible(!passwordVisible)} className='cursor-pointer text-white/70'>
                            {passwordVisible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={22} />}
                        </div>
                    </div>

                    <Button 
                        onClick={handleAuth} 
                        text={loading ? "Processing..." : (mode === "register" ? "Register" : "Login")} 
                        className="bg-[#ffba66] text-black font-bold p-3 hover:bg-[#dda200] transition-colors w-full" 
                        disabled={loading}
                    />
                </form>

                <div className="md:hidden mt-4 text-white text-sm">
                    {mode === "register" ? "Already have an account?" : "No account yet?"}
                    <button onClick={toggleMode} className="ml-2 text-[#ffba66] font-bold underline">
                        {mode === "register" ? "Login" : "Register"}
                    </button>
                </div>
            </div>

            <div className={`
                hidden md:flex 
                flex-col gap-8 justify-center items-center 
                bg-gradient-to-b from-[#d4b06b] via-[#ffffff] to-[#d4b06b] 
                w-1/2 h-full z-10 
                transition-all duration-700 ease-in-out transform 
                ${mode === "register" ? "-translate-x-full" : "translate-x-0"}
            `}>
                <h2 className='text-xl font-bold font-gravitas mb-4 text-black'>
                    {mode === "register" ? "Already have an account?" : "No Account? Create one."}
                </h2>
                <h3 className='text-xl font-bold text-center w-full font-playfair text-black px-10'>
                    {mode === "register" ? "Become a part of your own story." : "Let's dive into your world of books."}
                </h3>
                <h4 className="text-gray-800 font-medium text-center px-10">
                    {mode === "register" ? "Sign up and start curating your book universe." : "Log in and start your reading journey."}
                </h4>
                <Button 
                    onClick={toggleMode} 
                    text={mode === "register" ? "Login" : "Register"} 
                    className="bg-black text-white font-bold p-3 hover:bg-gray-800 transition-colors mt-4 w-1/2" 
                />
            </div>
        </div>
    );
}

export default Login;