# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app
RUN apt-get update && apt-get install libssl-dev

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

EXPOSE 9000

COPY . .

CMD [ "python3", "src/index.py", "--certificate", "src/certs/ssl_cert.pem", "--private-key", "src/certs/ssl_key.pem"]
