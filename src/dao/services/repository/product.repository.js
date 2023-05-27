export class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  find ({ page, limit }) {
    const result = this.dao.find({ page, limit })
    return result
  }

  findOne ({ pid, code }) {
    const result = this.dao.findOne({ pid, code })
    return result
  }

  create ({ obj, owner }) {
    const result = this.dao.create({ obj, owner })
    return result
  }

  udpate ({ pid, obj }) {
    const result = this.dao.udpate({ pid, obj })
    return result
  }

  delete ({ pid, user }) {
    const result = this.dao.delete({ pid, user })
    return result
  }
}
