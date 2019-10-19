const db = require('../repos/reservationRepo');

class Reservation {
    static async reserveRoom(user_id, room_id, room_status) {
        return await db.reserveRoom(user_id, room_id, room_status);
    }
};

module.exports = {
    Reservation
}