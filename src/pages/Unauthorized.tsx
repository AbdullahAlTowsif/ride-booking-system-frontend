import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { AlertTriangle } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-red-200 bg-white relative overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          {/* Warning Icon */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex items-center justify-center bg-red-100 text-red-600 w-16 h-16 rounded-full shadow"
          >
            <AlertTriangle size={36} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 text-center"
          >
            Unauthorized Access
          </motion.h1>

          {/* Funny animation: user gets kicked out */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 20, -20, 2000] }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
            className="text-lg text-gray-600 font-medium flex items-center gap-2"
          >
            🚶 <span>Oops! You got kicked out.</span> 🦵
          </motion.div>

          {/* Back to Login Button */}
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
