import config from '../../config/config.js'
import { connectMongo } from '../../utils/database.js'
import { ProductRepository } from './repository/product.repository.js'

let ProductService

switch (config.store) {
  case 'MONGO': {
    connectMongo()
    const { productMongo } = await import('../mongo/product.mongo.js')
    ProductService = productMongo
    break
  }
}

export const productService = new ProductRepository(ProductService)
