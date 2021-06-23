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

      const exchange = 'logs_exchange_direct';

      channel.assertExchange(exchange, 'direct', {
        durable: false,
      });

      setInterval(() => {
        const type =
          Math.random() > 0.5
            ? 'warning'
            : Math.random() > 0.7
            ? 'error'
            : 'info';
        const message =
          'RabbitMQ ' + type + ' ' + Math.round(Math.random() * 1000);
        channel.publish(exchange, type, Buffer.from(message));

        console.log('SENT MESSAGE "%s"', message);
      }, 1000);
    });
  });
};

init();
