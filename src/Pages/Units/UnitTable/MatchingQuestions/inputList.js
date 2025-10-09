import React, { useState } from 'react';
import './MatchingQuestions.css';

const MatchingQuestions = () => {
  const [pairs, setPairs] = useState([{ question: '', answer: '' }]);

  const addPair = () => {
    setPairs([...pairs, { question: '', answer: '' }]);
  };

  const removePair = (index) => {
    const updatedPairs = pairs.filter((_, i) => i !== index);
    setPairs(updatedPairs);
  };

  const handleQuestionChange = (index, value) => {
    const updatedPairs = pairs.map((p, i) =>
      i === index ? { ...p, question: value } : p
    );
    setPairs(updatedPairs);
  };

  const handleAnswerChange = (index, value) => {
    const updatedPairs = pairs.map((p, i) =>
      i === index ? { ...p, answer: value } : p
    );
    setPairs(updatedPairs);
  };

  return (
    <div className="matching-container">
      <h2 className="matching-header">Matching Questions</h2>
      {pairs.map((pair, index) => (
        <div key={index} className="pair-card">
          <textarea
            value={pair.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder="Enter your question"
            className="question-textarea"
          />
          <textarea
            value={pair.answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Enter your answer"
            className="answer-textarea"
          />
          <button onClick={() => removePair(index)} className="remove-btn">-</button>
        </div>
      ))}
      <button onClick={addPair} className="add-btn">+</button>
    </div>
  );
};

export default MatchingQuestions;
