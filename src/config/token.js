const jwt = require('jsonwebtoken');

const verify = async (authorization) => {
    const token = authorization.split(' ')[1];
    if (!authorization.length) {
        return {
            status: 400,
        };
    } else {
        try {
            const detoken = await jwt.verify(token, process.env.JWT_SECRET);
            if (!detoken) {
                return {
                    status: 401
                };
            } else {
                return {
                    status: 200,
                    email: detoken.email
                };
            }
        } catch (error) {
            return {
                status: 402
            };
        }
    }
}

module.exports = verify;