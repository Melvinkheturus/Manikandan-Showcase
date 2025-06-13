import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls } from "framer-motion";

const TypingText = ({
  words = ["Hello World", "Creative"],
  typingSpeed = 150,
  deleteSpeed = 100,
  delayBetweenWords = 1000,
  className = "",
  noLoop = false
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    // If we're done typing and noLoop is true, don't continue
    if (isDone) return;
    
    const word = words[currentWordIndex];

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        
        // If this is the last word and noLoop is true, don't continue to the next word
        if (noLoop && currentWordIndex === words.length - 1) {
          setIsDone(true);
          return;
        }
        
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        return;
      }

      const timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
      }, deleteSpeed);
      return () => clearTimeout(timer);
    }

    if (currentText === word) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenWords);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentText(word.substring(0, currentText.length + 1));
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    isDone,
    words,
    typingSpeed,
    deleteSpeed,
    delayBetweenWords,
    noLoop
  ]);

  useEffect(() => {
    controls.start({
      opacity: [0.2, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    });
  }, [controls]);

  return (
    <div className={className}>
      <div className="font-mono text-white">
        {currentText}
        <motion.span animate={controls}>|</motion.span>
      </div>
    </div>
  );
};

export default TypingText; 