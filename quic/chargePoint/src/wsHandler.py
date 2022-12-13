import json
import time
import uuid
async def handle_ws(ws):
    protocols = ['BootNotification', 'Heartbeat']
    for i in range(2):
        message = [i, protocols[i], 'BootNotification', {}]
        print("> " + str(message))
        await ws.send(json.dumps(message))

        message = await ws.recv()
        print("< " + str(message))
    while True:
        message = [uuid.uuid4().__str__(), 'Heartbeat', 'BootNotification', {}]
        print("> " + str(message))
        await ws.send(json.dumps(message))

        message = await ws.recv()
        print("< " + str(message))
        time.sleep(2)