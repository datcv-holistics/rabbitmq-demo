import amqp from 'amqplib/callback_api';

export const init = () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      throw err;
    }

    console.log('PRODUCER CONNECTED');

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = 'DURABLE_QUEUE';

      channel.assertQueue(queue, {
        durable: true,
      });

      setInterval(() => {
        const message = 'RabbitMQ ' + Math.round(Math.random() * 1000);
        channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

        console.log('SENT MESSAGE "%s"', message);
      }, 1000);
    });
  });
};

init();
