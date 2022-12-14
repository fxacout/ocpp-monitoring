"""Process individual messages from a WebSocket connection."""
import re
import json
from time import time
from mitmproxy import ctx, http, tcp, proxy
import requests

currentTimestamp = 0

baseUrlMonitoringLog= 'http://monitoring_log:3000/{}'
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