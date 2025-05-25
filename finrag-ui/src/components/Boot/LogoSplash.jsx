import { motion } from "framer-motion";

const LogoSplash = () => (
  <motion.div
    className="text-5xl text-white font-bold font-mono tracking-widest"
    initial={{ scale: 0.2, opacity: 0 }}
    animate={{ scale: 1.5, opacity: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  >
    <span className="glitch" data-text="FINRAG">FINRAG</span>
  </motion.div>
);

export default LogoSplash;
