import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatbaseAssistant } from '../utils/chatbase';
import { cn } from '../utils/cn';

interface ChatbotButtonProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'custom';
  showTooltip?: boolean;
  tooltipText?: string;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  className,
  position = 'bottom-right',
  showTooltip = true,
  tooltipText = 'Need help? Chat with us!'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkInitialization = () => {
      setIsInitialized(ChatbaseAssistant.isInitialized());
    };

    checkInitialization();
    const interval = setInterval(checkInitialization, 1000);

    const timer = setTimeout(() => setShowPulse(false), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleClick = () => {
    ChatbaseAssistant.toggle();
    setShowPulse(false);
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'custom': ''
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <div className={cn(positionClasses[position], 'z-40', className)}>
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-large flex items-center justify-center transition-all duration-300 group"
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {isHovered ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-75" />
        )}

        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white" />
      </motion.button>

      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: position === 'bottom-left' ? -10 : 10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: position === 'bottom-left' ? -10 : 10, y: 10 }}
            className={cn(
              'absolute bottom-full mb-3 whitespace-nowrap bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg',
              position === 'bottom-left' ? 'left-0' : 'right-0'
            )}
          >
            {tooltipText}
            <div
              className={cn(
                'absolute top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-neutral-900',
                position === 'bottom-left' ? 'left-6' : 'right-6'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotButton;
