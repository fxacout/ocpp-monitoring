FROM mitmproxy/mitmproxy:dev

WORKDIR /app

COPY certs/myCA.pem /usr/local/share/ca-certificates/foo.crt
RUN chmod 644 /usr/local/share/ca-certificates/foo.crt && update-ca-certificates

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 9000

ENTRYPOINT [ "mitmdump", "-p","9000", "--certs", "*=./certs/monitoringsystem.pem","--ssl-insecure", "--set", "confdir=./certs","--mode","reverse:quic://centralsystem:9000", "-s","./src/index.py"]
