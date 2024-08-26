
# AI-Enhanced Document QA System

## Overview
This project is an AI-enhanced Document Question-Answering (QA) system that ingests documents (PDF or plain text), processes them, and allows users to ask questions about the content. The system leverages advanced AI models and a vector database to provide accurate and contextually relevant answers.

## Features
- Document Ingestion: Upload PDF or plain text files for processing.
- Text Processing: Extracts text, performs chunking, and identifies named entities.
- Vector Embedding: Generates vector embeddings for document chunks.
- Question Answering: Users can ask questions, and the system retrieves relevant document chunks and generates answers.
- AI Integration: Uses GEMINI API for text analysis and question answering.
- Vector Database: Integrates with Pinecone for efficient vector storage and retrieval.
- Python Script: Performs topic modeling and updates document metadata in Pinecone.

## Tech Stack
- Backend: Node.js, Express
- Frontend: React
- Vector Database: Pinecone
- AI API: GEMINI API
- Python: Topic modeling and metadata update script

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Python 3 installed
- Pinecone account and API key
- Gemini API key

### Backend Setup
1. Clone the Repository
```bash
git clone https://github.com/vladengineerr/AI-chat-app
cd AI-chat-app
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Configure Environment Variables
Update a `config.env` file in the `Config` directory with the following:
```bash
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017
GEMINI_API_KEY="GEMINI_API_KEY"
PINECONE_API_KEY="PINECONE_API_KEY"
PINECONE_ENVIRONMENT="us-east-1"
PINECONE_INDEX_NAME="testing"
```

4. Start the Backend Server
```bash
npm start
```

### Frontend Setup
1. Navigate to the Frontend Directory
```bash
cd ../frontend
```

2. Install Frontend Dependencies
```bash
npm install
```

3. Start the Frontend Server
```bash
npm start
```

## Usage
1. Upload a Document: Navigate to the frontend at `http://localhost:3000`, upload a PDF and wait for processing.

2. Ask Questions: Once the document is processed, enter a question in the provided input field and submit.

3. View Answers: The system will display the answer along with the relevant document chunks.

## Conclusion
This project demonstrates the integration of advanced AI models, vector databases, and a full-stack web application. The system provides a foundation for building more complex AI-driven document processing and QA systems.
