import React from 'react';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { render, fireEvent, waitFor } from '@testing-library/react';

import DocumentUpload from '../components/DocumentUpload';

const axiosMock = new mockAxios(axios);

describe('DocumentUpload Component', () => {
    afterEach(() => {
        axiosMock.reset();
    });

    it('renders the component correctly', () => {
        const { getByText } = render(<DocumentUpload />);

        expect(getByText(/Drop file here/i)).toBeInTheDocument();
    });

    it('handles successful document upload', async () => {
        axiosMock.onPost('/api/upload').reply(200);

        const { getByText, getByTestId } = render(<DocumentUpload />);

        const input = getByTestId('input');
        const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(getByText('Document upload succeed')).toBeInTheDocument();
        });
    });

    it('handles failed document upload', async () => {
        axiosMock.onPost('/api/upload').reply(500);

        const { getByText, getByTestId } = render(<DocumentUpload />);

        const input = getByTestId('input');
        const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(getByText('Document upload failed')).toBeInTheDocument();
        });
    });
});
