import amqp from 'amqplib/callback_api';

export const init = () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      throw err;
    }

    console.log('CONSUMER CONNECTED');

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = 'DURABLE_QUEUE';

      channel.assertQueue(queue, {
        durable: true,
      });

      channel.prefetch(1);

      channel.consume(
        queue,
        (message) => {
          const content = message?.content.toString();
          console.log('\nPROCESSING: "%s"', content);
          setTimeout(() => {
            console.log('DONE: "%s"', content);
            if (!message) return;
            channel.ack(message);
          }, 1);
        },
        {
          noAck: false,
        }
      );
    });
  });
};

init();
