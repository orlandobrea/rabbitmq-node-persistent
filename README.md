# Aplicacion de prueba de colas

## Seteo del entorno

Crear el archivo de variables de entorno `.env` con un formato similar a...

```
USERNAME=<user>
PASSWORD=<password>
SERVER=<rabbitmq server and port>
```

## Producer

Envia 10 mensajes a la cola.

`npm run start:producer`

## Consumer

Recibe los mesajes de la cola. Emula un 20% de error en el procesamiento de los mensajes de la cola.

`npm run start:consumer`
