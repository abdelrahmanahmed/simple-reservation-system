'use strict';

const chai = require('chai');
const sinon = require('sinon');
const axios =require ('axios');
const roomStatusConfig = require('../config/db').roomStatus;

const { calculateRoomStatus, subtractUserBonus } = require('./reserveRoom');
const { expect } = chai;

describe('Reserve Room Utli', () => {

    it('Calculate Room Status and set it to reserved status ', () => {
        const user_bonus = 100;
        const required_points = 10;
        expect(calculateRoomStatus(user_bonus, required_points)).to.equal(roomStatusConfig.reserved);
    });
    it('Calculate Room Status and set it to pending_approval status ', () => {
        const user_bonus = 5;
        const required_points = 10;
        expect(calculateRoomStatus(user_bonus, required_points)).to.equal(roomStatusConfig.pending_approval);
    });
});