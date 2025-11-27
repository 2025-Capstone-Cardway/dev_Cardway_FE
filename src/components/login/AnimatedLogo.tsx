import React from "react";
import { motion, type Variants } from "framer-motion";
//import { MessageCircle } from "lucide-react";

export default function AnimatedLogo(){

    const titleText = "CardWay";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
        },
    };
        
    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
        visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
        },
        },
    };
    
    const cardStackVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -10 },
        visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
        },
    };
    
    const cardFloatVariants: Variants = {
        animate: {
        y: [0, -10, 0],
        rotate: [0, 2, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
        },
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-120 bg-gray-50 overflow-hidden font-sans">
        <motion.div
            className="z-10 flex flex-col items-center w-full max-w-md px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* 로고 영역 */}
            <motion.div 
                className="relative mb-10 w-32 h-32 flex items-center justify-center"
                variants={cardStackVariants}
            >
                {/* 뒤쪽 카드 */}
                <motion.div 
                    className="absolute w-20 h-28 rounded-xl shadow-lg transform -rotate-10 translate-x-[-10px]"
                    style={{ 
                        backgroundColor: "var(--color-orange-main)" 
                    }}
                    initial={{ opacity: 0, x: 0, rotate: 0 }}
                    animate={{ opacity: 0.8, x: -15, rotate: -15 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                />
                {/* 앞쪽 메인 카드 (Floating 애니메이션 적용) */}
                <motion.div
                    className="absolute w-20 h-28 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
                    variants={cardFloatVariants}
                    animate="animate"
                >
                {/*카드 내부 */}
                <div className="w-8 h-10 border-2 border-white/20 rounded-md flex flex-col justify-between p-1">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
                </motion.div>
            </motion.div>
    
            {/* 텍스트 애니메이션 */}
            <div className="mb-2 text-center overflow-hidden">
                <div className="flex justify-center gap-[1px] py-2">
                {titleText.split("").map((char, index) => (
                    <motion.span
                    key={index}
                    className="text-4xl font-extrabold text-gray-900 tracking-tight"
                    variants={itemVariants}
                    >
                    {char}
                    </motion.span>
                ))}
                </div>
            </div>
            
            <motion.p 
                className="mb-12 text-gray-500 text-sm font-medium"
                variants={itemVariants}
            >
                당신의 카드을 더 스마트하게
            </motion.p>
            </motion.div>
        </div>
    )
}