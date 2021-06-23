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

      const exchange = 'logs_exchange_direct';

      channel.assertExchange(exchange, 'direct', {
        durable: false,
      });

      channel.prefetch(1);

      channel.assertQueue('', { exclusive: true }, (error, queue) => {
        if (error) {
          throw error;
        }

        console.log('CONNECTED TO QUEUE "%s"', queue.queue);

        channel.bindQueue(queue.queue, exchange, 'error');
        channel.bindQueue(queue.queue, exchange, 'warning');

        channel.consume(queue.queue, (message) => {
          const content = message?.content.toString();
          console.log('\nPROCESSING: "%s"', content);
          setTimeout(() => {
            console.log('DONE: "%s"', content);
            if (!message) return;
            channel.ack(message);
          }, 1);
        });
      });
    });
  });
};

init();
