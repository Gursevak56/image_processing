interface IRequestRecord extends Document {
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  products: string[]; // store product IDs
  webhookUrl: string | null;
  createdAt: Date;
  completedAt?: Date;
}

export interface IRequestDocument extends IRequestRecord {}