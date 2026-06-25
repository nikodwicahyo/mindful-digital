"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { quizQuestions } from "@/data/content";

export function useQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const currentQuestionRef = useRef(currentQuestion);

  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      const qIndex = currentQuestionRef.current;
      const question = quizQuestions[qIndex];
      const optionScore = question.options[optionIndex].score;
      setScore((prev) => prev + optionScore);

      if (qIndex < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setIsComplete(false);
  }, []);

  return { currentQuestion, score, isComplete, selectAnswer, reset };
}
