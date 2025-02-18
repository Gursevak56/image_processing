import mongoose, { Schema, Document, model } from 'mongoose';
import { IProductDocument } from './../type/product';
const ProductSchema = new Schema<IProductDocument>({
    productId: { type: String, required: true },
    requestId: { type: String, required: true },
    serialNumber: { type: String, required: true },
    productName: { type: String, required: true },
    inputUrls: { type: [String], required: true },
    outputUrls: { type: [String], default: [] },
  });
  
export const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);
