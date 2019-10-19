'use strict';

const chai = require('chai');
const mockDb = require('mock-knex');
const chaiAsPromised = require('chai-as-promised');

const { expect } = chai;

chai.use(chaiAsPromised);

const tracker = mockDb.getTracker();


let db;
let usersReop;

describe.only('Users repo Test Suite ', function () {
  this.timeout(50000);
  before(() => {
    usersReop = require('./usersRepo');
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

  it('Get User', (done) => {
    const user_id = 1;
    const response = [{}];
    tracker.on('query', (query) => {
      if (query.sql === 'select * from `user` where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(user_id);
        query.response(response);

      } else {
        done(new Error(`Unknown Query - ${query.sql}`));
      }
    });
    expect(usersReop.getUser(user_id)).to.be.eventually.deep.equal({});
    done();
  });

  it('failed to Get User', (done) => {
    const user_id = 1;
    tracker.on('query', (query) => {
      if (query.sql === 'select * from `user` where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(user_id);
        throw new Error('Exception occurs while intersting data to db');
      } else {
        throw new Error(`Unknown Query - ${query.sql}`);
      }
    });
    usersReop.getUser()
      .catch((error) => {
        expect(error).to.be.an('error')
        done();
      })
  });

  it('Subtract User Bonus successfully', (done) => {
    const user_id = 1;
    const bonus = 1;
    const response = true;
    tracker.on('query', (query) => {
      if (query.sql === 'update `user` set `bonus` = ? where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(bonus);
        expect(query.bindings[1]).to.be.equal(user_id);
        query.response(response);

      } else {
        done(new Error(`Unknown Query - ${query.sql}`));
      }
    });
    expect(usersReop.subtractUserBonus(user_id, bonus)).to.be.eventually.deep.equal(response);
    done();
  });

  it('failed to Subtract User Bonus', (done) => {
    const user_id = 1;
    const bonus = 1;
    tracker.on('query', (query) => {
      if (query.sql === 'update `user` set `bonus` = ? where `id` = ?') {
        expect(query.bindings[0]).to.be.equal(bonus);
        expect(query.bindings[1]).to.be.equal(user_id);
        throw new Error('Exception occurs while intersting data to db');
      } else {
        throw new Error(`Unknown Query - ${query.sql}`);
      }
    });
    usersReop.subtractUserBonus(user_id, bonus)
      .catch((error) => {
        expect(error).to.be.an('error')
        done();
      })
  });


});
