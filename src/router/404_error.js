const router = require('express').Router();
const authMiddleware = require('../middleware/auth_middleware');

router.get('*',authMiddleware.oturumAcilmis,(req, res, next) => {
    console.log("hata");
    res.render('404_error', { layout: './layouts/home_layout.ejs', title: 'Sayfa Bulunamadı' });
  });



module.exports = router;