import asyncio
import logging
import websockets
from random import randrange

from ocpp.v201 import call
from ocpp.v201 import ChargePoint as cp

logging.basicConfig(level=logging.INFO)


class ChargePoint(cp):

    async def send_boot_notification(self):
        request = call.BootNotificationPayload(
            charging_station={
                'model': 'Wallbox XYZ',
                'vendor_name': 'anewone'
            },
            reason="PowerUp"
        )
        response = await self.call(request)

        if response.status == 'Accepted':
            print("Connected to central system.")

    async def send_heartbeats(self):
        while (True):
            request = call.HeartbeatPayload()
            await asyncio.sleep(3)
            response = await self.call(request)

            if response.current_time:
                print("Heartbeat payload received")


async def main(retries=0):
    MAX_RETRIES = 10

    while retries < MAX_RETRIES:
        chargePointId = randrange(1, 10000)
        try:
            async with websockets.connect(
                'ws://monitoring_system:9000/CP_{}'.format(chargePointId),
                subprotocols=['ocpp2.0.1']
            ) as ws:

                cp = ChargePoint('CP_{}'.format(chargePointId), ws)
                await asyncio.gather(cp.start(), cp.send_boot_notification(), cp.send_heartbeats())
        except:
            print("Couldn't connect to central system.")
            retries += 1
            if retries < MAX_RETRIES:
                await main(retries)
            else:
                print("Max retries reached. Exiting...")
                exit(1)


if __name__ == '__main__':
    asyncio.run(main())
