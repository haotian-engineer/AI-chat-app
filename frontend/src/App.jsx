import React, { useState } from 'react';

import DocumentUpload from './components/DocumentUpload';
import QuestionForm from './components/QuestionFrom';
import AnswerDisplay from './components/AnswerDisplay';

function App() {
  const [answer, setAnswer] = useState(null);
  const [relevantChunks, setRelevantChunks] = useState([]);

  return (
    <div className="w-4/5 m-auto text-center py-10">
      <p className="font-bold text-xl mb-5">AI-Enhanced Document QA System</p>
      <DocumentUpload />
      <QuestionForm
        setAnswer={setAnswer}
        setRelevantChunks={setRelevantChunks}
      />
      <AnswerDisplay answer={answer} relevantChunks={relevantChunks} />
    </div>
  );
}

export default App;
