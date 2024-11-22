import BaseService from './BaseService'

let instance = null
class ProductService extends BaseService {
  constructor() {
    super('products')
  }

  static getInstance() {
    if (!instance) {
      instance = new ProductService()
    }
    return instance
  }

  async getProduct() {
    return await this._get(`${this._prefix}`)
  }
}

export default ProductService
