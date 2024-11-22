import BaseService from './BaseService'

let instance = null
class AuthService extends BaseService {
  constructor () {
    super('auth')
  }

  static getInstance () {
    if (!instance) {
      instance = new AuthService()
    }
    return instance
  }

  async login (req) {
    return await this._post(`${this._prefix}/login`, req)
  }

  async register (req) {
    return await this._post(`${this._prefix}/register`, req)
  }

  async sendOTPCode (req) {
    return await this._post(`${this._prefix}/send-otp-code`, req)
  }

  async verifyOTPCode (req) {
    return await this._post(`${this._prefix}/verify-otp-code`, req)
  }

  async resetPassword (req) {
    return await this._post(`${this._prefix}/reset-password`, req)
  }

  async logout (req) {
    return await this._post(`${this._prefix}/logout`, req)
  }
}

export default AuthService
