import naver_login from "../../assets/login/naver_login.png";
import { motion } from "framer-motion";

const NaverLoginButton = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };
    
    return (
        <motion.button 
            onClick={handleLogin} 
            className="flex items-center justify-center h-12 rounded-lg bg-[#03C75A] shadow-md cursor-pointer overflow-hidden"
            whileHover={{ 
                scale: 1.05,
                backgroundColor: "#02B350",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ 
                scale: 0.95,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 17
            }}
        >
            <motion.img
                src={naver_login}
                alt="네이버 로그인"
                className='w-full h-full object-contain'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            />
        </motion.button>
    )
}

export default NaverLoginButton;
