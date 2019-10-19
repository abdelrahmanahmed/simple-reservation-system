'use strict';

const chai = require('chai');
const mockDb = require('mock-knex');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;

chai.use(chaiAsPromised);

const tracker = mockDb.getTracker();


let db;
let reserveRoom;

describe('Reservation Repo Test Suite ', function () {
  this.timeout(50000);
  before(() => {
    reserveRoom = require('./reservationRepo');
    db = require('../config/db').getDb();
  });

  beforeEach(function () {
    mockDb.mock(db);
    tracker.install();
  });
  afterEach(function () {
    mockDb.unmock(db);
    tracker.uninstall();
  });

  it('Reserve Room successfully', (done) => {
    const user_id = 2;
    const room_id = 'room_id';
    const room_status = 'room_status';
    const response = true;
    tracker.on('query', (query) => {
      if (query.sql === 'insert into `reservation` (`room_id`, `room_status`, `user_id`) values (?, ?, ?)') {
        expect(query.bindings[0]).to.be.equal(room_id);
        expect(query.bindings[1]).to.be.equal(room_status);
        expect(query.bindings[2]).to.be.equal(user_id);
        query.response(response);

      } else {
        done(new Error(`Unknown Query - ${query.sql}`));
      }
    });
    expect(reserveRoom.reserveRoom(user_id, room_id, room_status)).to.be.eventually.deep.equal(response);
    done();
  });

  it('failed to Reserve Room', (done) => {
    const user_id = 2;
    const room_id = 'room_id';
    const room_status = 'room_status';
    tracker.on('query', (query) => {
      if (query.sql === 'insert into `reservation` (`room_id`, `room_status`, `user_id`) values (?, ?, ?)') {
        expect(query.bindings[0]).to.be.equal(room_id);
        expect(query.bindings[1]).to.be.equal(room_status);
        expect(query.bindings[2]).to.be.equal(user_id);
        throw new Error('Exception occurs while intersting data to db');
      } else {
        throw new Error(`Unknown Query - ${query.sql}`);
      }
    });
    reserveRoom.reserveRoom(user_id, room_id, room_status)
      .catch((error) => {
        expect(error).to.be.an('error')
        done();
      })
  });

  
});
