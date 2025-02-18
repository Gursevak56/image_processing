import mongoose, { Schema, Document } from 'mongoose';
import { IRequestDocument } from './../type/request';
const RequestRecordSchema = new Schema<IRequestDocument>({
    requestId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'error'], required: true },
    products: { type: [String], default: [] },
    webhookUrl: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
  });

 export const RequestRecordModel = mongoose.model<IRequestDocument>('RequestRecord', RequestRecordSchema);
  