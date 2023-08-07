import asyncio
from random import randrange
import threading
import subprocess
from index import main
# Generate HTTP server that will listen on port 3000 and respond to requests with OK
from http.server import HTTPServer, BaseHTTPRequestHandler

process: subprocess.Popen = None

chargePointId = randrange(1, 10000)

class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        if not isRunning():
            self.wfile.write(bytes("{\"status\": \"restarting\"}", "utf-8"))
            start()
        else:
            self.wfile.write(bytes("{\"status\": \"running\"}", "utf-8"))
    def do_DELETE(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        if not isRunning():
            self.wfile.write(bytes("{\"status\": \"stopped\"}", "utf-8"))
        else:
            self.wfile.write(bytes("{\"status\": \"stopping\"}", "utf-8"))
            stop()
    def do_GET(self):
        if self.path == "/status":
          self.send_response(200)
          self.send_header("Content-type", "application/json")
          self.end_headers()
          self.wfile.write(bytes("{\"message\": \"Plugin Working Correctly\"}", "utf-8"))
        else:
          self.send_response(200)
          self.send_header("Content-type", "application/json")
          self.end_headers()
          if not isRunning():
              self.wfile.write(bytes("{\"status\": \"stopped\"}", "utf-8"))
          else:
              self.wfile.write(bytes("{\"status\": \"running\"}", "utf-8"))

def start():
    global process
    if process is None or process.poll() is not None:
        process = subprocess.Popen(["python3","./src/index.py", str(chargePointId)])
        print("Starting Charge Point...")
    else:
        print("Charge Point already running...")
def stop():
    global process
    if process is None or process.poll() is not None:
        print("Charge Point already stopped...")
    else:
        process.kill()
        print("Stopping Charge Point...")
def isRunning():
    global process
    if process is not None and process.poll() is None:
        return True
    else:
        return False
    
if __name__ == "__main__":
    # Start HTTP server
    server = HTTPServer(('0.0.0.0', 3000), MyServer)
    print("Starting Charge Point...")
    start()
    print("Starting server on port 3000...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()