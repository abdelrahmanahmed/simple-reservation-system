'use strict';

const chai = require('chai');
const mockDb = require('mock-knex');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;

chai.use(chaiAsPromised);

const tracker = mockDb.getTracker();


let db;
let reserveRoom;

describe('Rooms Repo Test Suite ', function () {
  this.timeout(50000);
  before(() => {
    reserveRoom = require('./roomsRepo');
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

  it('Get Available Rooms', (done) => {
    const response = [];
    tracker.on('query', (query) => {
      if (query.sql === 'select * from `room` where `available_amount` > ?') {
        expect(query.bindings[0]).to.be.equal(0);
        query.response(response);

      } else {
        done(new Error(`Unknown Query - ${query.sql}`));
      }
    });
    expect(reserveRoom.getAvailableRooms()).to.be.eventually.deep.equal(response);
    done();
  });

  it('failed to Get Available Rooms', (done) => {
    tracker.on('query', (query) => {
      if (query.sql === 'select * from `room` where `available_amount` > ?') {
        expect(query.bindings[0]).to.be.equal(0);
        throw new Error('Exception occurs while intersting data to db');
      } else {
        throw new Error(`Unknown Query - ${query.sql}`);
      }
    });
    reserveRoom.getAvailableRooms()
      .catch((error) => {
        expect(error).to.be.an('error')
        done();
      })
  });

  it('Decrease Room Availability successfully', (done) => {
    const room_id = 1;
    const response = [{}];
    tracker.on('query', (query) => {
      if (query.sql === 'update `room` set `available_amount` = `available_amount` - ? where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(room_id);
        query.response(response);

      } else {
        done(new Error(`Unknown Query - ${query.sql}`));
      }
    });
    expect(reserveRoom.decreaseRoomAvailability(room_id)).to.be.eventually.deep.equal(response);
    done();
  });

  it('failed to Decrease Room Availability', (done) => {
    const room_id = 1;
    const response = [{}];
    tracker.on('query', (query) => {
      if (query.sql === 'update `room` set `available_amount` = `available_amount` - ? where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(room_id);
        throw new Error('Exception occurs while intersting data to db');
      } else {
        throw new Error(`Unknown Query - ${query.sql}`);
      }
    });
    reserveRoom.decreaseRoomAvailability(room_id)
      .catch((error) => {
        expect(error).to.be.an('error')
        done();
      })
  });


});
