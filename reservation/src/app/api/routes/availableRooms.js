'use strict';
const router = require('express').Router();
const debug = require('debug')('reservation:api:routes:availableRooms');
const { Rooms } = require('../../services/roomsService');

const getAvailableRooms = async (req, res, next) => {
  debug('Get all available rooms');
  try {
    const result = await Rooms.getAvailableRooms();
    return res.send(result).status(200);
  }
  catch (error) {
    debug('error while getting available rooms', error);
    return res.send(error).status(400);
  }
};

router.get('/available-rooms', getAvailableRooms);

module.exports = router;