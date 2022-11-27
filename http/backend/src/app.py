from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['MONGO_URI'] = 'mongodb://mongodb/monitoring-logs'

mongo = PyMongo(app)

currentIds = []


@app.route('/chargePoint', methods=['POST'])
def charge_point_connected():
    # Receiving Data
    chargePointId = request.json['id']
    currentIds.append(chargePointId)
    timestamp = request.json['timestamp']
    duration = request.json['duration']
    mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'CONNECTION', 'timestamp' : timestamp, 'duration': duration}
    )
    socketio.emit('cp_connect', { 'id': chargePointId, 'latency': duration})
    return {
        'status_code' : 201
    }

@app.route('/getAllNodesId', methods=['GET'])
def get_all_nodes_id():
    # Receiving Data
    response = jsonify(currentIds)
    response.status_code = 200
    return response

@app.route('/heartbeat', methods=['POST'])
def charge_point_heartbeat():
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
    duration = request.json['duration']
    mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'HEARTBEAT', 'timestamp' : timestamp, 'duration': duration}
    )
    socketio.emit('cp_heartbeat', { 'id': chargePointId, 'latency': duration})
    return {
        'status_code' : 201
    }

@app.route('/disconnect', methods=['POST'])
def charge_point_disconnect():
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
    currentIds.remove(chargePointId)
    socketio.emit('cp_disconnect', { 'id': chargePointId})
    id = mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'DISCONNECT', 'timestamp' : timestamp})
    return {
        'status_code' : 201
    }

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    socketio.run(app,debug=True, port=3000)