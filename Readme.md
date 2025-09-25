
## ChatGPT Clone Project

This is a full-stack chat application inspired by ChatGPT. It lets users chat with an AI assistant, save conversations, and manage their chats easily. The project is built with a modern tech stack and focuses on clean code, practical features, and real-world learning.

### Features
- **AI Chat**: Users can chat with an AI powered by Google Gemini.
- **Authentication**: Secure login and registration with JWT and password hashing.
- **Chat Management**: Create, delete, and rename chats. Each chat gets a smart title from the AI.
- **Real-Time Messaging**: Messages are sent and received instantly using Socket.IO.
- **Persistent Storage**: All chats and messages are stored in MongoDB.
- **Redis Caching**: Recent messages are cached in Redis for fast access and performance.
- **Vector Search**: Pinecone is used for semantic search and memory features.
- **Responsive UI**: The frontend is built with React and Tailwind CSS for a clean, modern look.
- **Markdown Support**: AI responses are rendered with Markdown for better readability.

### Tech Stack
- **Frontend**: React, Vite, Zustand, Tailwind CSS, Axios, Socket.IO Client
- **Backend**: Node.js, Express, TypeScript, Socket.IO, Mongoose, JWT, Google Gemini API, Redis, Pinecone
- **Database**: MongoDB

### What I Learned
- Building a full-stack app from scratch using TypeScript for both backend and frontend.
- Setting up real-time communication with Socket.IO.
- Implementing authentication and secure session management.
- Integrating an external AI API (Google Gemini) and streaming responses.
- Managing state in React with Zustand.
- Designing RESTful APIs and connecting them to a frontend.
- Handling errors and edge cases for a smooth user experience.
- Using Redis for caching and improving performance.
- Using Pinecone for vector search and semantic memory.
- Using Tailwind CSS for fast and responsive UI development.
- Writing clean, maintainable code and organizing files for scalability.

### How It Works
1. Register or log in to start chatting.
2. Create a new chat or select an existing one from the sidebar.
3. Type your message and get instant AI responses.
4. Chats are saved and can be renamed automatically by the AI.
5. Recent messages are cached for speed, and semantic search is available.
6. Log out securely when done.

---
This project helped me understand how to connect all parts of a modern web app. I learned how to solve real problems and make features work smoothly together. Every part of the code is written to be simple, clear, and practical.
