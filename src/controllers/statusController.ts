import { Request, Response } from 'express';
import { ProductModel } from '../model/product';
import { RequestRecordModel } from '../model/request';

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  const { requestId } = req.params;
  try {
    const requestData = await RequestRecordModel.findOne({ requestId }).lean();
    if (!requestData) {
      res.status(404).json({ error: 'Request ID not found.' });
      return;
    }
    const products = await ProductModel.find({
      productId: { $in: requestData.products },
    }).lean();
    res.json({
      requestId,
      status: requestData.status,
      products,
    });
  } catch (err) {
    console.error("Error fetching status:", err);
    res.status(500).json({ error: 'Error fetching status.' });
  }
};
