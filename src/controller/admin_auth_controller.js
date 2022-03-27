const { validationResult } = require('express-validator');
const AdminUser = require('../model/admin_user_model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const login = (req, res, next) => {
    res.render('login', { layout: './layouts/auth_layout.ejs', title: 'Giriş' });
}
const loginPost = async (req, res, next) => {
    try {
        const hatalar = validationResult(req);
        req.flash('email', req.body.email);
        req.flash('password', req.body.password);
        if (!hatalar.isEmpty()) {
            req.flash('validation_error', hatalar.array());
            console.log(req.session);
            req.session.save(() => res.redirect('/admin/login'));
        } else {
            const _bulunanUser = await AdminUser.findOne({ where: { email: req.body.email } });
            if (!_bulunanUser) {
                req.flash('error', "Kullanıcı bulunamadı");
                return req.session.save(() => res.redirect('/admin/login'));
            } else {
                const sifreKontrol = await bcrypt.compare(req.body.password, _bulunanUser.password);
                if (!sifreKontrol) {
                    req.flash('error', "Şifre yanlış");
                    return req.session.save(() => res.redirect('/admin/login'));
                } else {
                    session = req.session;
                    session.userId = req.body.email;
                    return req.session.save(() => res.redirect('/admin'));
                }
            }
        }
    } catch (error) {
        console.log("login post catch hata=> " + error)
    }
}

const forgetPassword = (req, res, next) => {
    res.render('forget_password', { layout: './layouts/auth_layout.ejs', title: 'Şifremi Unuttum' });
}
const forgetPost = async (req, res, next) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);
        req.session.save(() => res.redirect('/admin/forget-password'));
    } else {
        try {
            const _user = await AdminUser.findOne({ where: { email: req.body.email } });
            if (_user) {
                const jwtBilgileri = {
                    id: _user.id,
                    mail: _user.email
                };
                const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;
                const jwtToken = jwt.sign(jwtBilgileri, secret, { expiresIn: '1d' });

                //MAIL GONDERME ISLEMLERI
                const url = process.env.WEB_SITE_URL + 'admin/reset-password/' + _user.id + "/" + jwtToken;
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "nodejsdersleri2757@gmail.com" ,
                        pass: "nodejsdersleri2757",
                    }
                });
                await transporter.sendMail({
                    from: 'To Do Uygulaması <info@nodejskursu.com',
                    to: _user.email,
                    subject: "Şifre Güncelleme",
                    text: "Şifrenizi oluşturmak için lütfen şu linki tıklayın:" + url
                }, (error, info) => {
                    if (error) {
                        req.flash('validation_error', [{ msg: 'Mail gönderilirken bir hata oluştu' }]);
                        transporter.close();
                        return req.session.save(() => res.redirect('/admin/forget-password'));
                    } else {
                        transporter.close();
                        req.flash('success_message', [{ msg: 'Lütfen mail kutunuzu kontrol edin' }]);
                        req.session.save(() => res.redirect('/admin/forget-password'));
                    }
                });
            } else {
                req.flash('validation_error', [{ msg: "Bu mail kayıtlı değil" }]);
                req.flash('email', req.body.email);
                req.session.save(() => res.redirect('/admin/forget-password'));
            }
        } catch (err) {
            console.log("Forget post catch hata => " + err);
        }
    }
}

const newPasswordSave = async (req, res, next) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('validation_error', hatalar.array());
        req.flash('password', req.body.password);
        req.flash('repassword', req.body.repassword);
        req.session.save(() => res.redirect('/admin/reset-password/' + req.body.id + "/" + req.body.token));

    } else {
        const _bulunanUser = await AdminUser.findOne({ where: { id: req.body.id, } });
        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.password;
        try {
            jwt.verify(req.body.token, secret, async (e, decoded) => {
                if (e) {
                    req.flash('error', 'Kod Hatalı veya Süresi Geçmiş');
                    req.session.save(() => res.redirect('/admin/reset-password'));
                } else {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const sonuc = await AdminUser.update({ password: hashedPassword }, { where: { id: req.body.id } });
                    if (sonuc) {
                        req.flash("success_message", [{ msg: 'Başarıyla şifre güncellendi' }]);
                        req.session.save(() => res.redirect('/admin/login'));
                    } else {
                        req.flash("error", 'Lütfen tekrar şifre sıfırlama adımlarını yapın');
                        req.session.save(() => res.redirect('/admin/forget-password'));
                    }
                }
            });
        } catch (err) {
            console.log("Hata cıktı sıfırlamada => " + err);
        }
    }
}
const newPassword = async (req, res, next) => {
    const linktekiID = req.params.id;
    const linktekiToken = req.params.token;

    if (linktekiID && linktekiToken) {
        const _bulunanUser = await AdminUser.findOne({ where: { id: linktekiID } });
        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.password;
        try {
            jwt.verify(linktekiToken, secret, async (e, decoded) => {
                if (e) {
                    req.flash('error', 'Kod Hatalı veya Süresi Geçmiş');
                    req.session.save(() => res.redirect('/admin/forget-password'));
                } else {
                    res.render('new_password', { id: linktekiID, token: linktekiToken, layout: './layouts/auth_layout.ejs', title: 'Şifre Güncelle' });
                }
            });
        } catch (err) {
            console.log("resset formunu göster " + err);
        }
    } else {
        req.flash('validation_error', [{ msg: "Lütfen maildeki linki tıklayın. Token Bulunamadı" }]);
        req.session.save(() => res.redirect('/admin/forget-password'));
    }
}


module.exports = {
    login,
    forgetPassword,
    loginPost,
    forgetPost,
    newPassword,
    newPasswordSave,
}

