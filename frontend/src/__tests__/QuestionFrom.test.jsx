import React from 'react';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { render, fireEvent, waitFor } from '@testing-library/react';

import QuestionForm from '../components/QuestionFrom';

const axiosMock = new mockAxios(axios);

describe('QuestionForm Component', () => {
  let setAnswerMock, setRelevantChunksMock;

  beforeEach(() => {
    setAnswerMock = jest.fn();
    setRelevantChunksMock = jest.fn();
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('renders the component correctly', () => {
    const { getByPlaceholderText, getByRole } = render(
      <QuestionForm setAnswer={setAnswerMock} setRelevantChunks={setRelevantChunksMock} />
    );

    expect(getByPlaceholderText('Ask anything...')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('handles input change', () => {
    const { getByPlaceholderText } = render(
      <QuestionForm setAnswer={setAnswerMock} setRelevantChunks={setRelevantChunksMock} />
    );

    const input = getByPlaceholderText('Ask anything...');
    fireEvent.change(input, { target: { value: 'What is React?' } });

    expect(input.value).toBe('What is React?');
  });

  it('handles form submission successfully', async () => {
    const mockResponse = {
      answer: 'React is a JavaScript library for building user interfaces.',
      relevantChunks: ['Component', 'State', 'Props']
    };

    axiosMock.onPost('/api/question').reply(200, mockResponse);

    const { getByPlaceholderText, getByRole } = render(
      <QuestionForm setAnswer={setAnswerMock} setRelevantChunks={setRelevantChunksMock} />
    );

    const input = getByPlaceholderText('Ask anything...');
    fireEvent.change(input, { target: { value: 'What is React?' } });

    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(setAnswerMock).toHaveBeenCalledWith(mockResponse.answer);
      expect(setRelevantChunksMock).toHaveBeenCalledWith(mockResponse.relevantChunks);
    });
  });

  it('handles form submission error', async () => {
    console.error = jest.fn();

    axiosMock.onPost('/api/question').reply(500);

    const { getByPlaceholderText, getByRole } = render(
      <QuestionForm setAnswer={setAnswerMock} setRelevantChunks={setRelevantChunksMock} />
    );

    const input = getByPlaceholderText('Ask anything...');
    fireEvent.change(input, { target: { value: 'What is React?' } });

    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error asking question', expect.anything());
      expect(setAnswerMock).not.toHaveBeenCalled();
      expect(setRelevantChunksMock).not.toHaveBeenCalled();
    });
  });
});
