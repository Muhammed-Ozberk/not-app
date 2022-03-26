const oturumAcilmis = (req, res, next) => {

    if (req.session.userId) {
        next();
    } else {
        req.flash('error', ['Lütfen önce oturum açın']);
        req.session.save(() => res.redirect('/admin/login'));
    }
}

const oturumAcilmamis = (req, res, next) => {

    if (!req.session.userId) {
        next();
    } else {
        res.redirect('/admin');
    }
}

module.exports = {
    oturumAcilmis,
    oturumAcilmamis
}