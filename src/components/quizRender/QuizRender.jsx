import React, { useState, useEffect } from "react";
import Questions from "../questions/Questions";
import "./QuizRender.css"

function QuizRender() {
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [secondsRemaining, setSecondsRemaining] = useState(10 * 60);
    const [isQuizStarted, setIsQuizStarted] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isQuizStarted) {
                setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1);
            }
        }, 1000);

        if (isQuizStarted && secondsRemaining === 0) {
            setIsQuizStarted(false);
        }

        return () => clearInterval(intervalId);
    }, [isQuizStarted, secondsRemaining]);

    function handleStartClick() {
        setIsQuizStarted(true);
        setCurrentQuestionIndex(0);
    }

    function handleAnswerClick(answer) {
        if (answer === Questions[currentQuestionIndex].correctAnswer) {
            setScore((prevScore) => prevScore + 1);
        }

        if (currentQuestionIndex === Questions.length - 1) {
            // the quiz is over, display the result
            setIsQuizStarted(false);
        } else {
            // move on to the next question
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    }

    function handleRestartClick() {
        setScore(0);
        setCurrentQuestionIndex(-1);
        setSecondsRemaining(10 * 60);
        setIsQuizStarted(false);
    }

    function handleCancelClick() {
        setIsQuizStarted(false);
        setCurrentQuestionIndex(-1);
    }

    const minutesUsed = Math.floor((10 * 60 - secondsRemaining) / 60);
    const secondsUsed = (10 * 60 - secondsRemaining) % 60;

    return (
        <div className="quiz-container">
            {!isQuizStarted ? (
                <>
                    <h1>Welcome to the quiz!</h1>
                    <button onClick={handleStartClick}>Start</button>
                </>
            ) : currentQuestionIndex === -1 ? (
                <p>Loading questions...</p>
            ) : (
                <>
                    <p className="questionColor">
                        Question {currentQuestionIndex + 1}:{" "}
                        {Questions[currentQuestionIndex].question}
                    </p>
                    <ul>
                        {Questions[currentQuestionIndex].answers.map((answer) => (
                            <li key={answer}>
                                <button onClick={() => handleAnswerClick(answer)}>{answer}</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {!isQuizStarted && currentQuestionIndex !== -1 && (
                <div className="quiz-finished">
                    <h1>Congratulations!</h1>
                    <p className="questionColor">You scored {score} out of {Questions.length}.</p>
                    <p className="questionColor">
                        You finished in {minutesUsed} minutes and {secondsUsed} seconds.
                    </p>
                    <button onClick={handleRestartClick}>Restart</button>
                </div>
            )}

            {isQuizStarted && currentQuestionIndex !== -1 && (
                <>
                    <p className="questionColor">Time remaining: {Math.floor(secondsRemaining / 60)}:{secondsRemaining % 60}</p>
                    <p className="questionColor">Score: {score}</p>
                    <button onClick={handleCancelClick}>Cancel</button>
                </>
            )}
        </div>
    );
}

export default QuizRender;