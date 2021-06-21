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

      const exchange = 'logs_exchange';

      channel.assertExchange(exchange, 'fanout', {
        durable: false,
      });

      setInterval(() => {
        const message = 'RabbitMQ ' + Math.round(Math.random() * 1000);
        channel.publish(exchange, '', Buffer.from(message));

        console.log('SENT MESSAGE "%s"', message);
      }, 1000);
    });
  });
};

init();
