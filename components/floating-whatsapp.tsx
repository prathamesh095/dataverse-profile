"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

/**
 * Ensures the phone number is cleaned of non-digit characters for the WhatsApp URL.
 * @param phone The input phone string (e.g., "+91 9021504844")
 * @returns Cleaned number (e.g., "919021504844")
 */
const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

export function FloatingWhatsApp({ phone }: { phone: string }) {
  // --- CHANGE 1: Set initial state to true to show immediately ---
  const [show, setShow] = useState(true); 
  const cleanedPhone = cleanPhoneNumber(phone);

  // --- CHANGE 2: Removed useEffect, as delay is no longer needed. ---

  // Use Framer Motion for a little feedback when clicking/tapping
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }} // Initial state is visible
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50`}
    >
      <Button
        size="lg"
        className="rounded-full shadow-2xl h-14 w-14 p-0 bg-green-500 hover:bg-green-600 transition-colors duration-300"
        asChild
        aria-label="Chat with Prathamesh on WhatsApp"
      >
        <a
          // Use the cleaned phone number for the URL
          href={`https://wa.me/${cleanedPhone}?text=Hello%20Prathamesh!%20I%20saw%20your%20portfolio.`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="sr-only">Start a WhatsApp chat</span>
        </a>
      </Button>
    </motion.div>
  );
}