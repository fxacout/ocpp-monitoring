"""Process individual messages from a WebSocket connection."""
import os
import random
from threading import Thread
import re
import json
from time import time
import time as time2
from mitmproxy import ctx, http, tcp, proxy
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


currentTimestamp = 0

baseUrlMonitoringLog= 'http://monitoring_log:3000/chargepoint/event/{}'
headers = {'content-type' : 'application/json'}


def  tcp_message(flow: tcp.TCPFlow):
    global currentTimestamp
    lastMessage = flow.messages[-1]
    chargePointId = flow.server_conn
    if lastMessage.from_client:
        print('Message from Client')
        currentTimestamp = time()
    elif currentTimestamp != 0:
        print('Message from Server')
        currentTimestamp = time() - currentTimestamp
        payload = {'timestamp': str(time()), 'duration': currentTimestamp}
        create_charge_point(chargePointId, flow.client_conn.peername[0], str(time()))
        requests.post(baseUrlMonitoringLog.format('heartbeat'), headers=headers,json=payload)
        currentTimestamp = 0

def quic_start_client(data: proxy.layers.quic.QuicTlsData):
    chargePointId  = data.context.server.sockname[1]
    print("Client: {0}, Server: {1}".format(data.context.client.sockname,chargePointId ), flush=True)
    payload = {'id': chargePointId, 'timestamp': str(time()), 'duration': 0}
    requests.post(baseUrlMonitoringLog.format('chargePoint'), headers=headers,json=payload)

def tcp_end(flow: tcp.TCPFlow):
    lastMessage = flow.messages[-1]
    print("TCP END: {}".format(lastMessage), flush=True)
    if '[' in str(lastMessage):
        payload = {'id':1, 'timestamp': str(time())}
        requests.post(baseUrlMonitoringLog.format('disconnect'), headers=headers, json=payload)

def create_charge_point(id, ip, lastPing, status = 'connected'):
    payload = {'id': id, 'ip': ip, 'lastPing': lastPing, 'status': status, 'centralSystem': central_system_name}
    requests.post('http://monitoring_log:3000/chargepoint/create', headers=headers,json=payload)