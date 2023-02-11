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

      const exchange = 'logs_exchange_topic';

      channel.assertExchange(exchange, 'topic', {
        durable: false,
      });

      setInterval(() => {
        const type =
          Math.random() > 0.5
            ? 'dog.error'
            : Math.random() > 0.7
            ? 'cat.error'
            : 'dog.info';
        const message =
          'RabbitMQ ' + type + ' ' + Math.round(Math.random() * 1000);
        channel.publish(exchange, type, Buffer.from(message));

        console.log('SENT MESSAGE "%s"', message);
      }, 1000);
    });
  });
};

init();
