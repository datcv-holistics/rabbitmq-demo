import amqp from 'amqplib/callback_api';

const user = {
  currentLocation: 'vn',
}

export const init = () => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) throw err;

    console.log('PRODUCER CONNECTED');

    connection.createChannel((err, channel) => {
      if (err) throw err;

      const exchange = 'order_topic_exchange';

      channel.assertExchange(exchange, 'topic', {
        durable: false,
      });

      setInterval(() => {
        const type = `${user.currentLocation}.order.food`
        const message = `Order 2 dishes of Noodle soup ${Math.random()}`

        channel.publish(exchange, type, Buffer.from(message));

        console.log('SENT MESSAGE "%s"', message);
      }, 1000);
    });
  });
};
