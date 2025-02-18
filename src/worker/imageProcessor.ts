// src/worker/imageProcessor.ts
import Queue from 'bull';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductModel } from '../model/product';
import { RequestRecordModel } from '../model/request';

// Ensure the directory for processed images exists
const processedDir = path.join(__dirname, '../processed_images');
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Create a Bull queue for asynchronous image processing (ensure Redis is running)
export const processingQueue = new Queue('imageProcessing', {
  redis: { host: '127.0.0.1', port: 6379 },
});

processingQueue.process(async (job) => {
  const { requestId, products } = job.data as {
    requestId: string;
    products: any[];
  };

  // Update the request status to 'processing'
  await RequestRecordModel.updateOne({ requestId }, { status: 'processing' });

  for (const product of products) {
    for (const url of product.inputUrls) {
      try {
        // Download the image using axios
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Compress the image using Sharp (reducing JPEG quality by 50%)
        const processedImageBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 50 })
          .toBuffer();

        // Save the processed image locally
        const filename = `${uuidv4()}.jpg`;
        const filepath = path.join(processedDir, filename);
        fs.writeFileSync(filepath, processedImageBuffer);

        // Construct a URL to access the processed image
        const processedImageUrl = `http://localhost:3000/processed_images/${filename}`;
        product.outputUrls.push(processedImageUrl);

        // Update product record with the new output URL
        await ProductModel.updateOne(
          { productId: product.productId },
          { $push: { outputUrls: processedImageUrl } }
        );
      } catch (error) {
        console.error('Error processing image:', url, error);
      }
    }
  }

  // Update the request status as completed once all products have been processed
  await RequestRecordModel.updateOne(
    { requestId },
    { status: 'completed', completedAt: new Date() }
  );

  // Optional: Trigger a webhook callback if a webhook URL was provided
  const requestRecord = await RequestRecordModel.findOne({ requestId });
  if (requestRecord && requestRecord.webhookUrl) {
    try {
      await axios.post(requestRecord.webhookUrl, {
        requestId,
        status: 'completed',
        products,
      });
      console.log('Webhook callback sent successfully.');
    } catch (err) {
      console.error('Error sending webhook callback:', err);
    }
  }

  return Promise.resolve();
});
