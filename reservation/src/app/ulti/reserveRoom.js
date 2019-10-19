const axios = require('axios');
const debug = require('debug')('reservation:ulti:reserveRoom');

const config = require('../config/app');
const roomStatusConfig = require('../config/db').roomStatus;

const subtractUserBonus = (user_id, user_bonus, room_required_points) => {
    const requestObj = {
        url: `${config.authentication.url}/${config.authentication.subtractUserBonus}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            appSecret: config.appSecret,
        },
        data: {
            user_id: user_id,
            bonus: user_bonus - room_required_points
        },
    };
    debug("send request to auth service", requestObj);
    return axios(requestObj);
}

const calculateRoomStatus = (bonus, required_points) => {
    return bonus >= required_points ? roomStatusConfig.reserved : roomStatusConfig.pending_approval;
}
module.exports = {
    subtractUserBonus,
    calculateRoomStatus
}