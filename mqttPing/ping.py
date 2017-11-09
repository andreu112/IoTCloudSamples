import paho.mqtt.client as mqtt

host = 'localhost'
port = 1883

def on_disconnect(client, userdata, rc):
    print('disconnected')

client = mqtt.Client(client_id="test1")
client.on_disconnect = on_disconnect
client.connect(host, port, 60)

client.loop_forever()
