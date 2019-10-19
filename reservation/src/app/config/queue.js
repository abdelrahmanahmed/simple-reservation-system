module.exports = {
  queue: 'reservationStatus',
  connection: { protocol: 'amqp', hostname: 'rabbitmq', port: 5672, username: 'user', password: 'password' }
};

