var amqp = require("amqplib/callback_api");
require('dotenv').config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const SERVER = process.env.SERVER;

const getExchangeName = () => "exchange-prueba";

const createChannel = async (connection) => {
  return new Promise((resolve, reject) => {
    connection.createChannel((err, channel) => {
      err ? reject(err) : resolve(channel);
    });
  });
};

const prepareChannel = async (channel) =>
  await channel.assertExchange(getExchangeName(), "topic", { durable: true });

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

(async () => {
  try {
    const connection = await getConnection();
    const channel = await createChannel(connection);
    await prepareChannel(channel);
    for (let i = 0; i < 10; i++) {
      const msg = JSON.stringify({ id: i, valor: "bienvenido a este mundo" });
      channel.publish(getExchangeName(), "andes.test002", Buffer.from(msg));
      console.log(" [x] sent %s", msg);
    }
  } catch (e) {
    console.log("Error ", e);
  }
})();
