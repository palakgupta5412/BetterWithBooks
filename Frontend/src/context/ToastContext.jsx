import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now(); // Unique ID based on time
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  // Function to remove a toast (used by timeout or close button)
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* --- THE TOAST CONTAINER UI --- */}
      {/* This renders the actual visual toasts on top of your app */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// --- INDIVIDUAL TOAST COMPONENT ---
const ToastItem = ({ toast, removeToast }) => {
  // Styles based on type
  const styles = {
    success: "bg-[#1a0f0e] border-[#ffba66] text-[#ffba66]",
    error: "bg-[#1a0f0e] border-red-500 text-red-500",
    info: "bg-[#1a0f0e] border-blue-400 text-blue-400",
  };

  const icons = {
    success: <FaCheckCircle size={20} />,
    error: <FaExclamationCircle size={20} />,
    info: <FaInfoCircle size={20} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      layout // smooths movement when other toasts disappear
      className={`
        min-w-[300px] p-4 rounded-xl border border-l-4 shadow-2xl 
        flex items-center gap-3 backdrop-blur-md bg-opacity-95
        ${styles[toast.type]}
      `}
    >
      {/* Icon */}
      <div className="shrink-0">{icons[toast.type]}</div>
      
      {/* Message */}
      <p className="flex-1 font-medium text-sm text-[#D8CFC4] font-sans">
        {toast.message}
      </p>

      {/* Close Button */}
      <button 
        onClick={() => removeToast(toast.id)} 
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        <FaTimes size={14} />
      </button>
    </motion.div>
  );
};