const db = require('../repos/roomsRepo');

class Rooms {
    static async getAvailableRooms() {
        return await db.getAvailableRooms();
    }
    static async getRoomAvailability(room_id) {
        return await db.getRoomAvailability(room_id);
    }
    static async decreaseRoomAvailability(room_id) {
        return await db.decreaseRoomAvailability(room_id);
    }
};

module.exports = {
    Rooms
}