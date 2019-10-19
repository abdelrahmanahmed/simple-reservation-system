const amqp = require('amqplib/callback_api');
const debug = require('debug')('reservation:ulti:producer');
const config = require('../config/queue');

const sendToQueue = (message) => {
    debug("Send Message To Queue");
    return new Promise((resolve, reject) => {
        amqp.connect(config.connection, (error0, connection) => {
            if (error0) {
                reject(error0);
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    reject(error1);
                }
                channel.assertQueue(config.queue, {
                    durable: false
                });
                channel.sendToQueue(config.queue, Buffer.from(message+""));

                debug(" [x] Sent %s", message);
                connection.close();
                resolve();
            });
        });
    })

}

module.exports = {
    sendToQueue
}