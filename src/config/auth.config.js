import '../utils/env.js'

export default {
  github: {
    clientId: process.env.PASSPORT_GITHUB_CLIENTID,
    clientSecret: process.env.PASSPORT_GITHUB_CLIENTSECRET,
    callbackUrl: process.env.PASSPORT_GITHUB_CALLBACKURL
  },
  jwtSessionSecret: process.env.JWT_SESSION_SECRET,
  passNodemailer: process.env.PASS_NODEMAILER
}
