export interface IProduct extends Document {
  productId: string;
  requestId: string;
  serialNumber: string;
  productName: string;
  inputUrls: string[];
  outputUrls: string[];
}

export interface IProductDocument extends IProduct {}
