const debug = require('debug')('reservation:repos:availableRoomsRepo');
const db = require('../config/db').getDb();


function reserveRoom(user_id, room_id, room_status) {
    debug('Reserve Room:');
    return new Promise((resolve, reject) => {
        return db('reservation')
            .insert({
                user_id: user_id,
                room_id: room_id,
                room_status: room_status,
            }).then(() => {
                debug('request to reserve room is done successfully');
                resolve(true);
            })
            .catch((err) => {
                debug('error while reserve room', err);
                reject(err);
            });
    })
}

module.exports = {
    reserveRoom
}