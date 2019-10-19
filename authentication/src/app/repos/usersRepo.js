const debug = require('debug')('authentication:repos:usersRepo');
const db = require('../config/db').getDb();

const subtractUserBonus = (user_id, bonus) => {
    debug('Update User Data');
    return new Promise((resolve, reject) => {
        return db('user')
            .update({ bonus })
            .where('id', user_id)
            .then((result) => {
                debug('user bonus updated');
                return resolve(true);
            })
            .catch((err) => {
                debug('error while updating user bonus', err);
                reject(err);
            });
    })
}

const getUser = (id) => {
    debug('Get User Data');
    return new Promise((resolve, reject) => {
        return db('user')
            .where('id', id)
            .then((result) => {
                debug('user data:', result[0]);
                return resolve(result[0]);
            })
            .catch((err) => {
                debug('error while getting user data', err);
                reject(err);
            });
    })
}


module.exports = {
    subtractUserBonus,
    getUser
}