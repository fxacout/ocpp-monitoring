# syntax=docker/dockerfile:1

FROM mitmproxy/mitmproxy:dev

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 9000

ENTRYPOINT [ "mitmdump", "-p","9000", "--mode","reverse:http://central_system:9000", "-s","./src/index.py"]
