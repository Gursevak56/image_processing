# Image Processing API

This project provides an **asynchronous image processing service** that allows users to upload a CSV file containing image URLs. The system downloads, compresses, and stores the processed images, returning a unique request ID to track the status.

## Features
- **Upload API**: Accepts a CSV file with image URLs.
- **Asynchronous Processing**: Uses **Bull (Redis queue)** for background jobs.
- **Image Compression**: Uses **Sharp** to compress images.
- **Status API**: Tracks the processing status.
- **Webhook Support**: Sends a callback when processing is complete.
- **MongoDB Database**: Stores request and product records.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Queue Processing**: Bull (Redis)
- **Image Processing**: Sharp
- **API Testing**: Postman

## Folder Structure
```
├── src
│   ├── config
│   │   ├── db.ts              # Database connection
│   ├── controllers
│   │   ├── uploadController.ts # Upload & processing logic
│   │   ├── statusController.ts # Status check logic
│   ├── middleware
│   │   ├── uploadMiddleware.ts # Multer for file upload
│   ├── models
│   │   ├── product.ts          # Product Schema
│   │   ├── request.ts          # Request Schema
│   ├── routes
│   │   ├── uploadRoutes.ts     # Upload API routes
│   │   ├── statusRoutes.ts     # Status API routes
│   ├── workers
│   │   ├── imageProcessor.ts   # Background worker processing
│   ├── server.ts               # Main server entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── README.md                    # Project documentation
```

## Setup & Installation
### Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB Atlas** or local MongoDB instance
- **Redis** (for Bull queue processing)

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and set the following:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/image_processing
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
```

### Run the Server
```sh
npm start  # Runs compiled JavaScript
# OR
npm run dev  # Runs in development mode with ts-node
```

## API Documentation
### **1. Upload API**
**Endpoint:** `POST /upload`
- **Request:** `multipart/form-data`
  - `csvFile`: CSV file with image URLs.
  - `webhookUrl` (optional): Callback URL.
- **Response:** `{ requestId: "unique-id" }`

### **2. Status API**
**Endpoint:** `GET /status/:requestId`
- **Response:** `{ requestId, status, products }`

## Postman Collection
[Click here](https://web.postman.co/workspace/52e957f0-33d6-41be-8141-051298c4113e/request/42409766-0cf0383e-ea3a-40c8-b43c-c2e0de7f11c2) to access the Postman collection for testing APIs.

## License
This project is licensed under the **MIT License**.

## Contributors
- **[Your Name]** - Developer

---
Let me know if you need any modifications! 🚀

