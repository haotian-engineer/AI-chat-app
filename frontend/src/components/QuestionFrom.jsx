import React, { useState } from 'react';
import axios from 'axios';

const QuestionForm = ({ setAnswer, setRelevantChunks }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API}/api/question`, { question })
      .then((response) => {
        console.log('response', response.data.context);
        setAnswer(response.data.answer);
        console.log(response.data.context.split('\n'));
        setRelevantChunks(response.data.context.split('\n'));
      })
      .catch((error) => {
        console.error('Error asking question', error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex mt-10 border-black border-2 rounded-full p-3 py-1"
    >
      <input
        type="text"
        value={question}
        placeholder="Ask anything..."
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full focus-visible:outline-none"
      />
      <button type="submit" className="w-8 h-8 rounded-full bg-slate-100">
        &rarr;
      </button>
    </form>
  );
};

export default QuestionForm;
