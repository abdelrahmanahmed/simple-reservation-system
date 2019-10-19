'use strict';
const router = require('express').Router();
const Joi = require('joi');
const debug = require('debug')('reservation:api:routes:reserveRoom');

const roomStatusConfig = require('../../config/db').roomStatus;
const { Rooms } = require('../../services/roomsService');
const { Reservation } = require('../../services/reservationService');
const { subtractUserBonus, calculateRoomStatus } = require('../../ulti/reserveRoom');
const { sendToQueue } = require('../../ulti/producer');

const validateRequest = (req, res, next) => {
  debug('Request Validation', req.body);
  const schema = Joi.object().keys({
    room_id: Joi.required(),
    user_id: Joi.required(),//to be removed
  });

  const result = schema.validate(req.body);
  if (!result.error) {
    debug('validation successful');
    return next();
  }
  debug('validation error', result.error);
  return next(result.error);
};

const reserveRoom = async (req, res, next) => {
  try {
    debug('Check Available Rooms');
    const result = await Rooms.getRoomAvailability(req.body.room_id);
    if (result) {
      const roomStatus = calculateRoomStatus(res.locals.user.bonus, result.required_points);
      debug('room status will set to', roomStatus);
      await Reservation.reserveRoom(req.body.room_id, res.locals.user.id, roomStatus);
      if (roomStatus === roomStatusConfig.reserved) {
        await Rooms.decreaseRoomAvailability(req.body.room_id);
        await subtractUserBonus(res.locals.user.id, res.locals.user.bonus, result.required_points);
        await sendToQueue(roomStatus);
      }
      res.status(200).send("Room is Reserved Successfully");
      return next();
    }
    else {
      res.status(404).send("no more rooms left");
      return next();
    }
  }
  catch (error) {
    debug('error while reserving a rooms', error.message);
    return next(error);
  }
};

router.post('/reserve-room', validateRequest, reserveRoom);

router.use((err, req, res, next) => {
  debug('Error Handler', err.message);
  res.status(400).send();
  return next();
});

module.exports = router;