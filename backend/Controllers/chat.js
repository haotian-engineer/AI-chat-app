const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { PineconeStore } = require('@langchain/pinecone');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { DocxLoader } = require('@langchain/community/document_loaders/fs/docx');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');

// Initialize logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'chat.log' })
  ]
});
console.log(process.env.PINECONE_API_KEY)
// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.questionAnswer = async (req, res) => {
  try {
    const { question } = req.body;
    const namespace = "test-namespace";

    if (!question) {
      logger.error('No question provided');
      return res.status(400).json({ error: 'No question provided' });
    }

    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "models/embedding-001"
    });

    // Initialize Pinecone index
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error('PINECONE_INDEX_NAME is not set in environment variables');
    }
    const pineconeIndex = pinecone.Index(indexName);

    // Log index statistics
    const indexStats = await pineconeIndex.describeIndexStats();

    // Create vector store with a specific namespace
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex, namespace: namespace || undefined });

    // Generate embedding for the question
    const questionEmbedding = await embeddings.embedQuery(question);

    // Search for relevant documents within the namespace
    let relevantDocs = await vectorStore.similaritySearch(question, 3);

    // If no relevant documents are found, try a direct Pinecone query
    if (relevantDocs.length === 0) {
      const queryResponse = await pineconeIndex.query({
        vector: questionEmbedding,
        topK: 1,
        includeMetadata: true,
        includeValues: true
      });
      console.log({ queryResponse });

      relevantDocs = queryResponse.matches.map(match => ({
        pageContent: match.metadata.pageContent,
      }));
    }
    let context = null
    // Check if we found any relevant documents
    if (relevantDocs.length != 0) {
      context = relevantDocs.map(doc => doc.pageContent).join('\n\n');
    }



    // Generate answer using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You will answer from the context, the context is just a reference for you to answer, if you don't have the answer in the context or if there is no context then answer yourself.
    Context: ${context}

    Question: ${question}

    Please provide a concise and accurate answer to the question based on the given context. If the context doesn't contain enough information to answer the question, please then answer yourself and don't tell that the info was not in the context.
    `;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer, context });
  } catch (error) {
    logger.error('Error processing question', error);
    console.error(error);
    res.status(500).json({ error: 'Error processing question', details: error.message });
  }
};

exports.uploadDoc = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      logger.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = file.mimetype;

    // Define the uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a temporary file path
    const tempFilePath = path.join(uploadsDir, file.originalname);

    // Write the file buffer to disk
    fs.writeFileSync(tempFilePath, file.buffer);

    let rawDocs;
    if (fileType === 'application/pdf') {
      const loader = new PDFLoader(tempFilePath);
      rawDocs = await loader.load();
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const loader = new DocxLoader(tempFilePath);
      rawDocs = await loader.load();
    } else {
      logger.error(`Invalid file type: ${fileType}`);
      fs.unlinkSync(tempFilePath);  // Clean up the temp file
      return res.status(400).json({ error: 'Invalid file type. Only PDF and DOCX are allowed.' });
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 40,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "models/embedding-001"
    });

    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error('PINECONE_INDEX_NAME is not set in environment variables');
    }

    const pineconeIndex = pinecone.Index(indexName);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: "test-namespace",
    });

    // Clean up the temp file after processing
    fs.unlinkSync(tempFilePath);

    res.json({ status: 'success', message: 'Document processed and stored' });
  } catch (error) {
    logger.error('Error processing document', error);
    console.error(error);
    res.status(500).json({ error: 'Error processing document', details: error.message });
  }
};