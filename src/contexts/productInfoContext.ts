import { catalogConnector } from '../data/catalogConnector';
import {
  ProductFullDataExternal,
  getFullProductData,
} from '../utils/dataAndTyping/catalogDTO';
import { catalogContext } from './catalogContext';

class ProductInfoContext {
  private productDataCache: Map<string, ProductFullDataExternal> = new Map();

  public ProductInfoContext() {}

  public async getProductData(id: string): Promise<ProductFullDataExternal> {
    const cached = this.productDataCache.get(id);
    if (cached) return cached;

    const [categories, response] = await Promise.all([
      catalogContext.getCategoryMap(),
      catalogConnector.requestProductInfo(id),
    ]);

    if (!response.ok)
      return Promise.reject('Failed to retrieve product information');

    const result = response.body;
    const data = getFullProductData(result, categories);
    this.productDataCache.set(id, data);

    return data;
  }
}

export const productInfoContext = new ProductInfoContext();
