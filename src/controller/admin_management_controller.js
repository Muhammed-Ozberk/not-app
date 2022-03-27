const User = require('../model/user_model');
const Mission = require('../model/mission_model');

const home = (req, res, next) => {
    res.redirect('/admin/dashboard-data');
}

const tables = async (req, res, next) => {
    try {
        let users = await User.findAll();
        if (users[0] == undefined) {
            users = {
                name: "Kullanıcı yok",
                email: "Kullanıcı yok"
            }
            req.flash('users', users);
            req.session.save();
            res.render('tables', { layout: './layouts/home_layout.ejs', title: "Tablolar" });
        } else {
            const newUsers = new Array();
            users.forEach(element => {
                newUsers.push({ name: element.name, email: element.email })
            });
            req.flash('users', newUsers);
            req.session.save();
            res.render('tables', { layout: './layouts/home_layout.ejs', title: "Tablolar" });
        }
    } catch (error) {
        console.log(error + " table catch hata");
    }
}
const tablesData = async (req, res, next) => {
    try {
        console.log("burda")
        let users = await User.findAll();
        if (users[0] == undefined) {
            users = {
                name: "Kullanıcı yok",
                email: "Kullanıcı yok"
            }
            req.flash('users', users);
            req.session.save(() => res.redirect('/admin/tables'));
        } else {
            const newUsers = new Array();
            users.forEach(element => {
                newUsers.push({ name: element.name, email: element.email })
            });
            req.flash('users', newUsers);
            req.session.save(() => res.redirect('/admin/tables'));
        }
    } catch (error) {
        console.log("tabledata catch hata =>" + error);
    }
}

const charts = (req, res, next) => {
    res.render('charts', { layout: './layouts/home_layout.ejs', title: "Grafikler" });
}
const chartsData = async (req, res, next) => {
    try {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let now = new Date().toString();
        now = now.split(' ');
        let pastMon = new Array();
        for (let index = 11; index >= 0; index--) {
            if (now[1] == months[index]) {
                for (let k = index; k >= 0; k--) {
                    pastMon.push(months[k]);
                }
                break;
            }
        }
        let sayac = 0;
        const users = await User.findAll();
        let monthsData = new Array();
        for (let index = pastMon.length - 1; index >= 0; index--) {
            sayac = 0;
            users.forEach(user => {
                if ((pastMon[index] == user.createdAt.toString().split(' ')[1]) && (user.createdAt.toString().split(' ')[3] == now[3])) {
                    sayac++;
                }
            });
            monthsData.push(sayac);
        };
        res.json({ monthsData });
    } catch (error) {
        console.log("chartsdata catch  hata =>" + error);
    }
}

const dashboard = async (req, res, next) => {
    try {
        const users = await User.findAll();
        let totalNumUser = 0;
        users.forEach(element => {
            totalNumUser++;
        });
        let monthNumUser = 0;
        let now = new Date().toString();
        now = now.split(' ');
        users.forEach(element => {
            if (now[1] == element.createdAt.toString().split(' ')[1]) {
                monthNumUser++;
            }
        });
        const mission = await Mission.findAll();
        let totalNumMission = 0;
        mission.forEach(element => {
            totalNumMission++;
        });
        let complatedMission = 0;
        mission.forEach(element => {
            if (element.DesStatus == true) {
                complatedMission++;
            }
        });
        complatedMission = complatedMission == 0 ? complatedMission : ((complatedMission * 100) / totalNumMission).toFixed(2);
        const dashData = [monthNumUser, totalNumUser, complatedMission, totalNumMission];
        req.flash('dashData', dashData);
        req.session.save();
        res.render('dashboard', { layout: './layouts/home_layout.ejs', title: "Göstergeler" });
    } catch (error) {
        console.log("dashboard catch hata => " + error);
    }
}
const dashboardData = async (req, res, next) => {
    try {
        const users = await User.findAll();
        let totalNumUser = 0;
        users.forEach(element => {
            totalNumUser++;
        });
        let monthNumUser = 0;
        let now = new Date().toString();
        now = now.split(' ');
        users.forEach(element => {
            if (now[1] == element.createdAt.toString().split(' ')[1]) {
                monthNumUser++;
            }
        });
        const mission = await Mission.findAll();
        let totalNumMission = 0;
        mission.forEach(element => {
            totalNumMission++;
        });
        let complatedMission = 0;
        mission.forEach(element => {
            if (element.DesStatus == true) {
                complatedMission++;
            }
        });
        complatedMission = complatedMission == 0 ? complatedMission : ((complatedMission * 100) / totalNumMission).toFixed(2);
        const dashData = [monthNumUser, totalNumUser, complatedMission, totalNumMission];
        req.flash('dashData', dashData);
        req.session.save(() => res.redirect('/admin/dashboard'));
    } catch (error) {
        console.log("dashboardData catch hata =>" + error);
    }
}

const logout = (req, res, next) => {
    req.session.destroy((error) => {
        res.clearCookie('connect.sid');
        res.render('login', { layout: './layouts/auth_layout.ejs', title: 'Giriş Yap', success_message: [{ msg: 'Başarıyla çıkış yapıldı' }] });
    });
}

module.exports = {
    home,
    tables,
    tablesData,
    charts,
    chartsData,
    dashboard,
    dashboardData,
    logout,

}