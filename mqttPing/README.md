# mqtt ping

This python module uses the unique id property of clients to simulate a ping to an mqtt client, whether it is a consumer or a publisher.

## Idea
mqtt requires that each client has a unique id. If another client tries to connect using an existing id on the broker then it is instantly disconnected.

This python module creates mqtt clients with the ids provided, in the event that the connection is disconnected, we can deduce the mqtt client we try to 'ping' is still alive.
