#
# demo application for http3_server.py
#
import os
import json
from datetime import datetime

from starlette.applications import Starlette
from starlette.routing import WebSocketRoute
from starlette.types import Receive, Scope, Send
from starlette.websockets import WebSocketDisconnect

ROOT = os.path.dirname(__file__)

def handle_message(message, chargePointId):
    print(">" + message + "id:" + chargePointId)
    protId, requestId, ocppProtocol, extraParams = json.loads(message)
    response = []
    if ocppProtocol == "BootNotification":
        response = [3,requestId,{"currentTime":datetime.now().strftime("%d/%m/%YT%H:%M:%S"),"interval":10,"status":"Accepted"}]
    if ocppProtocol == "Heartbeat":
        response = [3,requestId,{"currentTime":datetime.now().strftime("%d/%m/%YT%H:%M:%S")}]

    print("<" + str(response))
    return json.dumps(response)

async def ws(websocket):
    """
    WebSocket echo endpoint.
    """
    print('INFOOOO',flush=True)
    chargePointId = websocket.path_params["cpid"]
    if "ocpp" in websocket.scope["subprotocols"]:
        subprotocol = "ocpp"
    else:
        subprotocol = None
    await websocket.accept(subprotocol=subprotocol)

    try:
        while True:
            response = handle_message(await websocket.receive_text(), chargePointId)
            await websocket.send_text(response)
    except WebSocketDisconnect:
        pass

starlette = Starlette(
    routes=[
        WebSocketRoute("/{cpid}", ws),
    ]
)


async def app(scope: Scope, receive: Receive, send: Send) -> None:
    await starlette(scope, receive, send)
