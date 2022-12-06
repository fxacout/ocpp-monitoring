# syntax=docker/dockerfile:1

FROM python:3.8-slim-buster

WORKDIR /app
RUN apt-get update && apt-get install libssl-dev

COPY src/certs/myCA.pem /usr/local/share/ca-certificates/foo.crt
RUN chmod 644 /usr/local/share/ca-certificates/foo.crt && update-ca-certificates

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

EXPOSE 9000

COPY . .

CMD [ "python3", "src/index.py"]
