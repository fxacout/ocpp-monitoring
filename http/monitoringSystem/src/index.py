"""Process individual messages from a WebSocket connection."""
import os
import random
from threading import Thread
import re
import json
from time import time
import time as time2
from mitmproxy import ctx, http
import requests

def generate_random_animal_name():
    animal_list = list(["monkey", "alpaca", "dog", "koala", "cat", "elephant", "giraffe", "lion", "tiger", "panda", "penguin", "pig", "rabbit", "snake", "zebra"])
    adjectives_list = list(["adorable", "beautiful", "clean", "drab", "elegant", "fancy", "glamorous", "handsome", "long", "magnificent", "old-fashioned", "plain", "quaint", "sparkling", "ugliest", "unsightly", "angry", "bewildered", "clumsy", "fierce", "grumpy", "lazy", "mysterious", "nervous", "obnoxious", "panicky", "repulsive", "scary", "thoughtless", "uptight", "worried"])
    return f"{random.choice(adjectives_list)}-{random.choice(animal_list)}"

central_system_name = generate_random_animal_name()

requestIdTypeDict = dict()

charge_points_IP = set()

def ping_IP():
    print(f"Ping thread started for Central System {central_system_name}")
    while True:
        for [ip, id] in charge_points_IP:
            response = os.system("ping -c 1 " + ip + " > /dev/null 2>&1")

            #and then check the response...
            if response == 0:
                print(f"{ip} is up!")
                change_chargepoint_ping(id)
            else:
                print(f"{ip} is down!")
        time2.sleep(10)

has_thread_started = False

def start_ping_thread():
    global has_thread_started
    if not has_thread_started:
        has_thread_started = True
        Thread(target = ping_IP).start()

start_ping_thread()



baseUrlMonitoringLog= 'http://monitoring_log:3000/chargepoint/event/{}'
headers = {'content-type' : 'application/json'}

def get_chargePoint_id(message: bytes) -> str:
    messageString = message.decode("utf-8")
    id = re.search(r'CP_(.*?)', messageString)
    return messageString[id.end():] or ''

def get_duration_time(message_created: float) -> float:
    return time() - message_created


def websocket_message(flow: http.HTTPFlow):
    assert flow.websocket is not None  # make type checker happy
    # get the latest message
    message = flow.websocket.messages[-1]

    # was the message sent from the client or server?
    if message.from_client:
        ctx.log.info(f"Client sent a message: {message.content!r} with IP: {flow.client_conn.peername[0]}")
        [_, requestId, request_type, _] = json.loads(message.content.decode())
        charge_points_IP.add(tuple([flow.client_conn.peername[0], get_chargePoint_id(flow.request.data.path)]))
        create_charge_point(get_chargePoint_id(flow.request.data.path), flow.client_conn.peername[0], str(time()))
        chargePointId = get_chargePoint_id(flow.request.data.path)
        requestIdTypeDict[requestId] = [request_type, chargePointId]
    else:
        [_, requestId, _] = json.loads(message.content.decode())

        ctx.log.info(f"Server sent a message: {message.content!r}")

        request_type, chargePointId = requestIdTypeDict.pop(requestId)

        payload = {'id': chargePointId, 'timestamp': str(time()), 'duration': get_duration_time(message.timestamp)}
        send_monitoring_info(payload, request_type)
        

def send_monitoring_info(payload, event):
    requests.post(baseUrlMonitoringLog.format(event), headers=headers,json=payload)

def create_charge_point(id, ip, lastPing, status = 'connected'):
    payload = {'id': id, 'ip': ip, 'lastPing': lastPing, 'status': status, 'centralSystem': central_system_name}
    requests.post('http://monitoring_log:3000/chargepoint/create', headers=headers,json=payload)

def change_chargepoint_status(id, status):
    payload = {'id': id, 'status': status}
    requests.put('http://monitoring_log:3000/chargepoint/{}'.format(id), headers=headers,json=payload)

def change_chargepoint_ping(id):
    payload = {'id': id}
    requests.put('http://monitoring_log:3000/chargepoint/{}/ping'.format(id), headers=headers,json=payload)

def websocket_end(flow:http.HTTPFlow):
    change_chargepoint_status(get_chargePoint_id(flow.request.data.path), 'disconnected')

