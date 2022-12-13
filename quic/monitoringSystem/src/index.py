"""Process individual messages from a WebSocket connection."""
import re
import json
from time import time
from mitmproxy import ctx, http, tcp, proxy
import requests

requestIdTypeDict = dict()

baseUrlMonitoringLog= 'http://monitoring_log:3000/{}'
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
        ctx.log.info(f"Client sent a message: {message.content!r}")
        [_, requestId, request_type, _] = json.loads(message.content.decode())

        chargePointId = get_chargePoint_id(flow.request.data.path)
        requestIdTypeDict[requestId] = [request_type, chargePointId]
    else:
        [_, requestId, _] = json.loads(message.content.decode())

        ctx.log.info(f"Server sent a message: {message.content!r}")

        request_type, chargePointId = requestIdTypeDict[requestId]

        if request_type == 'BootNotification':
            payload = {'id': chargePointId, 'timestamp': str(time()), 'duration': get_duration_time(message.timestamp)}
            requests.post(baseUrlMonitoringLog.format('chargePoint'), headers=headers,json=payload)

        if request_type == 'Heartbeat':
            payload = {'id':get_chargePoint_id(flow.request.data.path), 'timestamp': str(time()), 'duration': get_duration_time(message.timestamp)}
            requests.post(baseUrlMonitoringLog.format('heartbeat'), headers=headers,json=payload)

    # manipulate the message content
    # message.content = re.sub(rb'Heartbeat', b'Beatheart', message.content)

    if b'FOOBAR' in message.content:
        # kill the message and not send it to the other endpoint
        message.drop()

def websocket_end(flow:http.HTTPFlow):
    payload = {'id':get_chargePoint_id(flow.request.data.path), 'timestamp': str(time())}
    requests.post(baseUrlMonitoringLog.format('disconnect'), headers=headers, json=payload)

def  tcp_message(flow: tcp.TCPFlow):
    lastMessage = flow.messages[-1]
    print(lastMessage.content)
    if lastMessage.from_client:
        print('Message from Client, {}'.format(json.loads(re.search(r"(\[.*\])", str(lastMessage.content)).group(1))))
    else:
        print('Message from Server, {}'.format(lastMessage.content))

def quic_start_client(data: proxy.layers.quic.QuicTlsData):
    print(data.context.client.sockname)