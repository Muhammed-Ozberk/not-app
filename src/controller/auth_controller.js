const User = require("../model/user_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const _user = await User.findOne({ where: { email: req.body.email } });
        if (_user) {
            res.json({ message: 'Bu email kullanımda', status: false })
        } else {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const savedUser = await User.create(({
                email: req.body.email,
                name: req.body.name,
                password: hashPassword,
            }));
            if (!savedUser) {
                res.json({ message: 'Kullanıcı kaydedilirken bir hata oluştu', status: false })
            } else {
                const token = await jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
                res.json({ message: 'Kullanıcı başarıyla kaydedildi', status: true, token: token });
            }
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu', status: false });
    }
}

const login = async (req, res, next) => {
    try {
        const _user = await User.findOne({ where: { email: req.body.email } });
        if (!_user) {
            res.json({ message: 'Kullanıcı bulunamadı', status: false });
        } else {
            const resolvePassword = await bcrypt.compare(req.body.password, _user.password)
            if (!resolvePassword) {
                res.json({ message: 'Şifre hatalı', status: false });
            } else {
                const token = await jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
                res.json({ message: 'Kullanıcı doğrulandı', token: token, status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu', status: false });
    }

}


module.exports = {
    register,
    login
}