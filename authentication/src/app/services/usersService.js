const db = require('../repos/usersRepo');

class Users {
    static async subtractUserBonus(id, bonus) {
        return await db.subtractUserBonus(id, bonus);
    }
    static async getUser(id) {
        return await db.getUser(id);
    }
};

module.exports = {
    Users
}