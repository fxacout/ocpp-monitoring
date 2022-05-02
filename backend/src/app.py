from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://mongodb/monitoring-logs'

mongo = PyMongo(app)


@app.route('/chargePoint', methods=['POST'])
def charge_point_connected():
    # Receiving Data
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
    id = mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'CONNECTION', 'timestamp' : timestamp})
    return {
        'status_code' : 201
    }


@app.route('/heartbeat', methods=['POST'])
def charge_point_heartbeat():
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
    id = mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'HEARTBEAT', 'timestamp' : timestamp})
    return {
        'status_code' : 201
    }

@app.route('/disconnect', methods=['POST'])
def charge_point_disconnect():
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
    id = mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': 'DISCONNECT', 'timestamp' : timestamp})
    return {
        'status_code' : 201
    }

@app.route('/duration', methods=['POST'])
def charge_point_duration():
    chargePointId = request.json['id']
    duration = request.json['duration']
    id = mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId,'duration': duration, 'Type': 'TLS'})
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
    app.run(debug=True, port=3000)