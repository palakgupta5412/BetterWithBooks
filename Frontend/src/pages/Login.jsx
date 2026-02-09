import React, { useState } from 'react';
import Button from '../components/Button';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth.service'; 

const Login = () => {
    const navigate = useNavigate();

    // 1. UI State (Matches your original logic)
    const [mode, setMode] = useState("login"); // 'login' or 'register'
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 2. Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    // Handle typing in inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when typing
    };

    // 3. Toggle Mode (Only switches the screen, doesn't submit)
    const toggleMode = (e) => {
        if(e) e.preventDefault();
        setMode(mode === "login" ? "register" : "login");
        setError("");
    };

    // 4. Submit to Backend
    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        console.log("Submitting form data:", formData); // Debug log

        try {
            if (mode === "login") {
                // Login Logic
                const response = await loginUser({ 
                    email: formData.email, 
                    password: formData.password 
                });
                console.log("Login Success:", response);
                navigate("/"); 
            } else {
                // Register Logic
                const response = await registerUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                console.log("Register Success:", response);
                
                // Optional: Auto-login after register
                await loginUser({ 
                    email: formData.email, 
                    password: formData.password 
                });
                navigate("/");
            }
        } catch (err) {
            console.error("Full Error Object:", err); // Check Console for this!
            setError(err.message || "Connection failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen relative flex justify-center gap-1 items-center p-20 px-44'>
            {/* Background */}
            <img src='/login.jpg' alt='Background' className='w-full h-full object-cover opacity-100 blur-sm inset-0 bg-black/70 absolute'/>

            {/* Error Message (Floating at top) */}
            {error && (
                <div className="absolute top-10 z-50 bg-red-600 text-white px-6 py-2 rounded shadow-lg">
                    {error}
                </div>
            )}

            {/* --- FORM SECTION (Left Side) --- */}
            <div className={`bg-black/50 w-1/2 h-full flex flex-col justify-center items-center gap-8 p-10 z-10 transition-all duration-500 ease-in-out transform 
                ${mode === "register" ? "translate-x-full" : "translate-x-0" }`}>
                
                <h1 className='font-gravitas text-white text-4xl'>{mode === "register" ? "Register" : "Login"}</h1>
                
                <form className='w-full flex flex-col gap-6' onSubmit={handleAuth}>
                    
                    {/* Name Input - Only visible in Register mode */}
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Name' 
                        className={`w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white transition-all ${mode === "login" ? "hidden" : "block"}`}
                    />

                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email' 
                        className='w-full p-3 outline-none bg-transparent border border-white/50 text-white placeholder-white '
                        required
                    />

                    <div className='w-full flex justify-between items-center gap-2 border border-white/50 pr-4'>    
                        <input 
                            type={passwordVisible ? "text" : "password"} 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder='Password' 
                            className='w-full p-3 outline-none bg-transparent text-white placeholder-white '
                            required
                        />
                        <div onClick={() => setPasswordVisible(!passwordVisible)} className='cursor-pointer text-white/70'>
                            {passwordVisible ? <FaRegEye size={20} /> : <FaRegEyeSlash size={22} />}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <Button 
                        onClick={handleAuth} 
                        text={loading ? "Processing..." : (mode === "register" ? "Register" : "Login")} 
                        className="bg-[#ffba66] text-black font-bold p-3 hover:bg-[#dda200] transition-colors w-full" 
                        disabled={loading}
                    />
                </form>
            </div>

            {/* --- INFO PANEL (Right Side / Slider) --- */}
            <div className={`p-10 flex flex-col gap-8 justify-center items-center bg-[linear-gradient(to_bottom,#d4b06b,#ffffff,#d4b06b)] w-1/2 h-full z-10 transition-all duration-500 ease-in-out transform 
                ${mode === "register" ? "-translate-x-full" : "translate-x-0"}`}>
                
                <h2 className='text-xl font-bold font-gravitas mb-4 '>
                    { mode === "register" ? "Already have an account?" : "No Account? Create one." }
                </h2>
                
                <h3 className='text-xl font-bold text-center w-full font-playfair'>
                    {mode === "register" ? "Become a part of your own story." : "Let's dive into your world of books."}
                </h3>
                
                <h4>
                    {mode === "register" ? "Sign up and start curating your book universe." : "Log in and start your reading journey."}
                </h4>
                
                {/* TOGGLE BUTTON (Switches Mode) */}
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