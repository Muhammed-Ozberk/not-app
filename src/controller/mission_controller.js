const Missions = require('../model/mission_model');
const Token = require('../config/token');
const sequelize = require('sequelize');


const missionAdd = async (req, res, next) => {
    try {
        const mail = Token(req.headers.authorization)
        const savedMission = await Missions.create(({
            title: req.body.title,
            userEmail: (await mail).email,
            description: req.body.description
        }));
        if (!savedMission) {
            res.json({ message: 'Notunuz kaydedilirken bir hata oluştu', status: false })
        } else {
            res.json({ message: 'Notunuz başarıyla kaydedildi', status: true });
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu lütfen tekrar deneyiniz', status: false });
    }
}

const missionDelete = async (req, res, next) => {
    try {
        const mail = Token(req.headers.authorization)
        const _missions = await Missions.findOne({ where: { id: req.body.id, userEmail: (await mail).email } });
        if (!_missions) {
            res.json({ message: 'Not bulunamadı', status: false });
        } else {
            const deleted_missions = await _missions.destroy();
            if (!deleted_missions) {
                res.json({ message: 'Not silinirken bir hata oluştu', status: false })
            } else {
                res.json({ message: 'Başarıyla silindi', status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu lütfen tekrar deneyiniz', status: false });
    }
}

const missionList = async (req, res, next) => {
    try {
        const mail = Token(req.headers.authorization)
        const mission_list = await Missions.findAll({ where: { userEmail: (await mail).email } });
        if (!mission_list) {
            res.json({ message: 'Notlar getirilirken bir hata oluştu', status: false });
        } else {
            const complated = new Array();
            const notComplated = new Array();
            mission_list.forEach(element => {
                if (!element.isComplete) {
                    let user = {
                        id: element.id,
                        title: element.title,
                        description: element.description,
                        isComplete: element.isComplete,
                        createdAt: element.createdAt
                    }
                    notComplated.push(user);
                } else {
                    let user = {
                        id: element.id,
                        title: element.title,
                        description: element.description,
                        isComplete: element.isComplete,
                        createdAt: element.createdAt
                    }
                    complated.push(user);
                }
            });
            res.json({
                message: 'Notlar başarıyla getirildi',
                status: true,
                data: {
                    complated: complated,
                    notComplated: notComplated
                }
            });
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu', status: false });
    }
}

const missionUpdate = async (req, res, next) => {
    try {
        const _user = await Missions.findOne({ where: { id: req.body.id } });
        if (!_user) {
            res.json({ message: 'Not bulunamadı', status: false });
        } else {
            const update_user = await _user.update({
                title: req.body.title,
                description: req.body.description,
            })
            if (!update_user) {
                res.json({ message: 'Not güncellenirken bir hata oluştu', status: false })
            } else {
                res.json({ message: 'Not başarıyla güncellendi', status: true })
            }
        }
    } catch (error) {
        res.json({ message: 'Not güncelenirken bir hata oluştu', status: false });
    }
}

const missionIsCompleted = async (req, res, next) => {
    try {
        const _user = await Missions.findOne({ where: { id: req.body.id } });
        if (!_user) {
            res.json({ message: 'Not bulunamadı', status: false });
        } else {
            const update_user = await _user.update({
                isComplete: !_user.isComplete
            })
            if (!update_user) {
                res.json({ message: 'Notun durumu değiştirilirken bir hata oluştu', status: false })
            } else {
                res.json({ message: 'Notun durumu bşarıyla değiştirildi', status: true })
            }
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu', status: false });
    }
}

const missionSearch = async (req, res, next) => {
    try {
        const mail = Token(req.headers.authorization)
        let aranacakKelime = req.body.search;
        let combining = /[\u0300-\u036F]/g;
        aranacakKelime = aranacakKelime.normalize('NFKD').replace(combining, '');

        const searchList = await Missions.findAll({
            where: sequelize.and({ userEmail: (await mail).email }, sequelize.or({
                description: { [sequelize.Op.substring]: aranacakKelime }
            }, { title: { [sequelize.Op.substring]: aranacakKelime } }))
        });
        if (!searchList) {
            res.json({ message: 'Arama yapılırken bir hata çıktı', status: false })
        } else {
            const complated = new Array();
            const notComplated = new Array();
            searchList.forEach(element => {
                if (!element.isComplete) {
                    const user = {
                        id: element.id,
                        title: element.title,
                        description: element.description,
                        createdAt: element.createdAt
                    }
                    notComplated.push(user);
                } else {
                    const user = {
                        id: element.id,
                        title: element.title,
                        description: element.description,
                        createdAt: element.createdAt
                    }
                    complated.push(user);
                }
            });
            res.json({
                message: 'Notlar başarıyla getirildi',
                status: true,
                data: {
                    complated: complated,
                    notComplated: notComplated
                }
            });
        }
    } catch (error) {
        res.json({ message: 'Bilinmeyen bir hata oluştu', status: false });
    }
}

module.exports = {
    missionAdd,
    missionDelete,
    missionList,
    missionUpdate,
    missionIsCompleted,
    missionSearch
}
