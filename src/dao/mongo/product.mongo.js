import { response } from '../../utils/response.js'
import { productModel } from '../models/product.model.js'
import { Product } from '../patterns/product.pattern.js'

import { HandlerError, NameError, CodeError, InfoError } from '../../lib/errors/index.js'

class ProductMongo {
  async find ({ page, limit }) {
    try {
      if (typeof page === 'undefined') page = 1
      if (typeof limit === 'undefined') limit = 10

      if (page < 1) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Page must be greater than 0'
        })
      }
      if (limit < 1) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Limit must be greater than 0'
        })
      }

      const result = await productModel.paginate({}, { page, limit, lean: true })
      return response(200, result)
    } catch (error) {
      new HandlerError().createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async findOne ({ pid, code }) {
    try {
      if (!pid && !code) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Code or ID are required'
        })
      }

      let exist

      if (!pid && !pid.match(/^[0-9a-fA-F]{24}$/)) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Invalid ID'
        })
        exist = await productModel.findById({ _id: pid }).lean()
      } else {
        exist = await productModel.findOne({ code }).lean()
      }

      if (!exist) {
        new HandlerError().createError({
          name: NameError.RESOURCE_NOT_FOUND_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }

      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create ({ obj, owner }) {
    try {
      if (typeof obj !== 'object') {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Invalid data'
        })
      }

      if (!obj.title) new HandlerError().createError({ name: NameError.QUERY_ERROR, code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Title are required' })
      if (!obj.code) new HandlerError().createError({ name: NameError.QUERY_ERROR, code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Code are required' })
      if (!obj.price) new HandlerError().createError({ name: NameError.QUERY_ERROR, code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Price are required' })
      if (!obj.stock) new HandlerError().createError({ name: NameError.QUERY_ERROR, code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Stock are required' })
      if (!obj.category) new HandlerError().createError({ name: NameError.QUERY_ERROR, code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Category are required' })

      const exist = await productModel.findOne({ code: obj.code })
      if (exist) new HandlerError().createError({ name: NameError.INVALID_QUERY_ERROR, code: CodeError.UNPROCESSABLE_ENTITY, cause: InfoError.UNPROCESSABLE_ENTITY, message: 'The product already exists' })

      const product = new Product({
        title: obj.title,
        description: obj.description,
        code: obj.code,
        price: obj.price,
        status: obj.status,
        stock: obj.stock,
        category: obj.category,
        thumbnails: obj.thumbnails,
        owner
      })

      const result = await productModel.create(product)
      return response(201, result)
    } catch (error) {
      new HandlerError().createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async udpate ({ pid, obj }) {
    try {
      if (!pid) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Id are required'
        })
      }
      if (!obj) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Data are required'
        })
      }

      if (!pid && !pid.match(/^[0-9a-fA-F]{24}$/)) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Invalid ID'
        })
      }

      if (typeof obj !== 'object') {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Invalid data'
        })
      }

      const exist = await productModel.findById(pid)
      if (!exist) {
        new HandlerError().createError({
          name: NameError.RESOURCE_NOT_FOUND_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }

      exist.title = obj.title || exist.title
      exist.description = obj.description || exist.description
      exist.code = obj.code || exist.code
      exist.price = obj.price || exist.price
      exist.status = obj.status
      exist.stock = obj.stock || exist.stock
      exist.category = obj.category || exist.category
      exist.thumbnails = obj.thumbnails || exist.thumbnails

      const result = await productModel.updateOne({ _id: pid }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not modified' })
      return response(200, exist)
    } catch (error) {
      new HandlerError().createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete ({ pid, user }) {
    try {
      if (!pid && !pid.match(/^[0-9a-fA-F]{24}$/)) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Invalid ID'
        })
      }

      const exist = await productModel.findById(pid)
      if (!exist) {
        new HandlerError().createError({
          name: NameError.RESOURCE_NOT_FOUND_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }

      const { _id, role } = user
      if (role === 'premium' && exist.owner.toString() !== _id.toString()) {
        new HandlerError().createError({
          name: NameError.PERMISSION_DENIED_ERROR,
          code: CodeError.FORBIDDEN,
          cause: InfoError.FORBIDDEN,
          message: 'Permission denied'
        })
      }

      const result = await productModel.deleteOne({ _id: pid })
      const { deletedCount } = result
      if (!(deletedCount > 0)) return response(202, null, { message: 'Not deleted' })
      return response(200, result)
    } catch (error) {
      new HandlerError().createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }
}

export const productMongo = new ProductMongo()
