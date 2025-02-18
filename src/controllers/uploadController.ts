import { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';
import { ProductModel } from '../model/product';
import { RequestRecordModel } from '../model/request';
import { processingQueue } from '../worker/imageProcessor';

export const uploadCsv = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'CSV file is required.' });
    return;
  }

  const webhookUrl: string | null = req.body.webhookUrl || null;
  const requestId = uuidv4();

  // Create a new RequestRecord in MongoDB
  const requestRecord = new RequestRecordModel({
    requestId,
    status: 'pending',
    products: [],
    webhookUrl,
    createdAt: new Date(),
  });

  requestRecord.save().catch((err: any) =>
    console.error("Error saving request record:", err)
  );

  const products: any[] = []; // Temporarily hold product data

  fs.createReadStream(req.file.path)
    .pipe(
      csvParser({
        mapHeaders: ({ header }) =>
          header.trim().replace(/^\uFEFF/, ''),
      })
    )
    .on('data', (row: any) => {
      // Validate required fields
      if (!row['S. No.'] || !row['Product Name'] || !row['Input Image Urls']) {
        console.error('Invalid row format:', row);
        return;
      }

      const inputUrls: string[] = row['Input Image Urls']
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0);

      const product = {
        productId: uuidv4(),
        requestId,
        serialNumber: row['S. No.'],
        productName: row['Product Name'],
        inputUrls,
        outputUrls: [] as string[],
      };

      products.push(product);

      // Save each product to the database
      const productDoc = new ProductModel(product);
      productDoc.save().catch((err: any) =>
        console.error("Error saving product:", err)
      );

      // Update the request record with the product ID
      RequestRecordModel.updateOne(
        { requestId },
        { $push: { products: product.productId } }
      ).catch((err: any) =>
        console.error("Error updating request record with product:", err)
      );
    })
    .on('end', () => {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
          }          
      // Enqueue a job for asynchronous image processing
      processingQueue.add({ requestId, products });
      res.json({ requestId });
    })
    .on('error', (err: Error) => {
      console.error('Error processing CSV file:', err);
      res.status(500).json({ error: 'Error processing CSV file.' });
    });
};
