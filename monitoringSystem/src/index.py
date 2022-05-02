"""Process individual messages from a WebSocket connection."""
import re
from time import time
from mitmproxy import ctx, http
import requests



baseUrlMonitoringLog= 'http://monitoring_log:3000/{}'
headers = {'content-type' : 'application/json'}

def get_chargePoint_id(message: bytes) -> str:
    messageString = message.decode("utf-8")
    id = re.search(r'CP_(.*?)', messageString)
    return messageString[id.end():] or ''

def get_request_type(message: bytes):
    messageString = message.decode("utf-8")
    isHeartbeat = re.search(r'Heartbeat', messageString)

    if isHeartbeat != None:
        return 'Heartbeat'
    
    isBootNotification = re.search(r'BootNotification',messageString)

    if isBootNotification != None:
        return 'BootNotification'
    
    return ''


def websocket_message(flow: http.HTTPFlow):
    assert flow.websocket is not None  # make type checker happy
    # get the latest message
    message = flow.websocket.messages[-1]

    # was the message sent from the client or server?
    if message.from_client:
        ctx.log.info(f"Client sent a message: {message.content!r}")
        request_type = get_request_type(message.content)

        if request_type == 'BootNotification':
            payload = {'id':get_chargePoint_id(flow.request.data.path), 'timestamp': str(time())}
            requests.post(baseUrlMonitoringLog.format('chargePoint'), headers=headers,json=payload)

        if request_type == 'Heartbeat':
            payload = {'id':get_chargePoint_id(flow.request.data.path), 'timestamp': str(time())}
            requests.post(baseUrlMonitoringLog.format('heartbeat'), headers=headers,json=payload)
    else:
        ctx.log.info(f"Server sent a message: {message.content!r}")

    # manipulate the message content
    # message.content = re.sub(rb'Heartbeat', b'Beatheart', message.content)

    if b'FOOBAR' in message.content:
        # kill the message and not send it to the other endpoint
        message.drop()

def websocket_end(flow:http.HTTPFlow):
    payload = {'id':get_chargePoint_id(flow.request.data.path), 'timestamp': str(time())}
    requests.post(baseUrlMonitoringLog.format('disconnect'), headers=headers, json=payload)