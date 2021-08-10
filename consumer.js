var amqp = require("amqplib/callback_api");
require('dotenv').config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const SERVER = process.env.SERVER;

const getChannel = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.createChannel((err, channel) => {
      err ? reject(err) : resolve(channel);
    });
  });
};

const handleError = (err) => console.log("Error en la conexión ", err);

const getConnection = async () => {
  return new Promise((resolve, reject) => {
    amqp.connect(
      `amqp://${USERNAME}:${PASSWORD}@${SERVER}`,
      (err, connection) => {
        err ? reject(err) : resolve(connection);
      }
    );
  });
};

const processMessage = (msg) => {
  // Emular 20% de errores en el procesamiento
  if (Math.random() < 0.2) throw new Error("Prueba de error");
  console.log("Recibi...", msg);
};

(async () => {
  try {
    const connection = await getConnection();
    const channel = await getChannel(connection);
    const queue = "prueba-orly";
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.consume(queue, (message) => {
      const data = JSON.parse(message.content.toString());
      try {
        processMessage(data);
        channel.ack(message);
      } catch (e) {
        console.log("reintentando para ", data);
        channel.nack(message);
      }
    });
  } catch (e) {
    console.log("Error ", e);
  }
})();
