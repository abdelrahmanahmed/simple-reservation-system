const debug = require('debug')('reservation:repos:availableRoomsRepo');
const db = require('../config/db').getDb();

const getAvailableRooms = () => {
    debug('Get Available Rooms:');
    return new Promise((resolve, reject) => {
        return db('room')
            .where('available_amount', '>', 0)
            .then((result) => {
                debug('Number of Available rooms:', result.length);
                resolve(result);
            })
            .catch((err) => {
                debug('error while getting available rooms', err);
                reject(err);
            });
    })
}

const getRoomAvailability = (room_id) => {
    debug('Get Number of Rooms Availability:');
    return new Promise((resolve, reject) => {
        return db('room')
            .where('id', room_id)
            .andWhere('available_amount', '>', 0)
            .then((result) => {
                debug('Succes');
                resolve(result[0]);
            })
            .catch((err) => {
                debug('error while getting Number of Rooms Availability', err);
                reject(err);
            });
    })
}

const decreaseRoomAvailability = (room_id) => {
    debug('decrease Availability of room:', room_id);
    return new Promise((resolve, reject) => {
        return db('room')
            .decrement('available_amount')
            .where('id', room_id)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                debug('error while decrease Availability of room', err);
                reject(err);
            });
    })
}

module.exports = {
    getAvailableRooms,
    getRoomAvailability,
    decreaseRoomAvailability
}