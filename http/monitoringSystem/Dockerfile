# syntax=docker/dockerfile:1

FROM mitmproxy/mitmproxy:dev

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN apt-get update && apt-get install -y iputils-ping

COPY . .

EXPOSE 9000

ENTRYPOINT [ "mitmdump", "-p","9000", "--mode","reverse:http://central_system:9000", "-s","./src/index.py"]
