'use strict';

module.exports.getUserAccessData = () => {
  const user = 'user';
  const admin = 'admin';

  return {
    '/authorize': {
      POST: [user, admin],
    },
    '/available-rooms': {
      GET: [user, admin],
    },
    '/reserve-room': {
      POST: [user, admin],
    },
  };
};
