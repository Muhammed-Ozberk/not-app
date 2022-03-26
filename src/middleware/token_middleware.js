const Token = require('../config/token')
const tokenControl = async (req, res, next) => {
    try {
        const mail = Token(req.headers.authorization)
        if ((await mail).status !== 200) {
            res.json({ message: 'Token geçersiz lütfen tekrar giriş yapın', status: false })
        } else {
            next();
        }
    } catch (error) {
        res.json({ message: 'Token kontrol edilirken bir hata oluştu', status: false })
    }
}

module.exports = tokenControl;