import React from 'react';
import { render, screen } from '@testing-library/react';

import AnswerDisplay from '../components/AnswerDisplay';

describe('AnswerDisplay Component', () => {
  test('renders the answer correctly', () => {
    const answer = "This is the answer";
    const relevantChunks = [];

    render(<AnswerDisplay answer={answer} relevantChunks={relevantChunks} />);

    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText(answer)).toBeInTheDocument();
  });

  test('renders relevant document chunks correctly', () => {
    const answer = "Another answer";
    const relevantChunks = [
      "Relevant chunk 1",
      "Relevant chunk 2",
      "Relevant chunk 3",
    ];

    render(<AnswerDisplay answer={answer} relevantChunks={relevantChunks} />);

    expect(screen.getByText('Relevant Document Chunks:')).toBeInTheDocument();
    relevantChunks.forEach((chunk) => {
      expect(screen.getByText(chunk)).toBeInTheDocument();
    });
  });

  test('renders no relevant chunks if list is empty', () => {
    const answer = "Answer with no relevant chunks";
    const relevantChunks = [];

    render(<AnswerDisplay answer={answer} relevantChunks={relevantChunks} />);

    expect(screen.getByText('Answer:')).toBeInTheDocument();
    expect(screen.getByText(answer)).toBeInTheDocument();
    expect(screen.getByText('Relevant Document Chunks:')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).toBeNull();
  });
});
