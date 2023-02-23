import amqp from 'amqplib/callback_api';

export const init = () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) throw err;

    console.log('CONSUMER CONNECTED');

    connection.createChannel((err, channel) => {
      if (err) throw err;

      const exchange = 'order_topic_exchange';

      channel.assertExchange(exchange, 'topic', {
        durable: false,
      });

      channel.prefetch(1);

      channel.assertQueue('', { exclusive: true }, (error, queue) => {
        if (error) throw error;

        console.log('CONNECTED TO QUEUE "%s"', queue.queue);

        channel.bindQueue(queue.queue, exchange, 'vn.order.*');

        channel.consume(queue.queue, (message) => {
          if (!message) return;

          const content = message?.content.toString();
          
          console.log('\nReceived Message: "%s"', content);

          channel.ack(message);
        });
      });
    });
  });
};
