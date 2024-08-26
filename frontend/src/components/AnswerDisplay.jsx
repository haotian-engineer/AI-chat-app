import React from 'react';

const AnswerDisplay = ({ answer, relevantChunks }) => {
  return (
    <div className="grid gap-2 grid-cols-3 py-5">
      <div className="col-span-2 flex flex-col text-left">
        <p className="font-bold text-lg">Answer:</p>
        <p>{answer}</p>
      </div>
      <div className="flex flex-col text-left">
        <p className="font-bold text-lg">Relevant Document Chunks:</p>
        <ul>
          {relevantChunks.map((chunk, index) => (
            <li key={index}>{chunk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnswerDisplay;
