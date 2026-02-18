"use client";
import { motion } from "framer-motion";

export default function GlassCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="
        backdrop-blur-xl 
        bg-white/10 
        border border-white/20
        shadow-2xl
        rounded-2xl
        p-6
        hover:scale-105
        transition
      "
    >
      {children}
    </motion.div>
  );
}
