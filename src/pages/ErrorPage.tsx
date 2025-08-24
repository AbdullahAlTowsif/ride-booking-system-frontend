import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Title */}
      <h1 className="text-6xl font-extrabold mb-6">⚡ Oops!</h1>
      <p className="text-lg text-gray-300 mb-8">I think you are lost. Go back to Homepage</p>

      {/* Shock Animation */}
      <div className="relative w-40 h-60 flex justify-center items-center">
        {/* Man */}
        <motion.div
          className="w-12 h-24 bg-gray-300 rounded-md relative flex flex-col items-center"
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            x: [0, -5, 5, -5, 5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          {/* Head */}
          <div className="w-10 h-10 bg-gray-500 rounded-full absolute -top-10 flex items-center justify-center text-xl">
            😵
          </div>
          {/* Legs */}
          <div className="absolute bottom-0 flex gap-2">
            <div className="w-3 h-10 bg-gray-400 rounded"></div>
            <div className="w-3 h-10 bg-gray-400 rounded"></div>
          </div>
        </motion.div>

        {/* Electric Wire */}
        <motion.div
          className="absolute left-0 top-10 w-40 h-1 bg-yellow-400"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.3,
          }}
        />

        {/* Sparks */}
        <motion.div
          className="absolute left-0 top-10 text-yellow-300 text-2xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          ⚡
        </motion.div>
      </div>

      {/* Button */}
      <Button
        className="mt-10 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl text-lg shadow-lg"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
}
