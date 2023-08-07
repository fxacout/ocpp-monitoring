from flask import Flask, jsonify, request, Response
from random import randrange
from flask_pymongo import PyMongo
from datetime import datetime, date
from time import time

import requests
from flask_socketio import SocketIO
from flask_cors import CORS
from bson import json_util
from pymongo import DESCENDING

app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

app.config['MONGO_URI'] = 'mongodb://mongodb/monitoring-logs'

mongo = PyMongo(app)



@app.route('/chargepoint/event/<operation>', methods=['POST'])
def charge_point_connected(operation):
    # Receiving Data
    chargePointId = request.json['id']
    print(chargePointId)
    charge_point = mongo.db.chargePoints.find_one({'id': chargePointId})
    if charge_point == None or charge_point['status'] != 'connected':
        print('Charge Point is not connected')
        return {
            'status_code' : 201
        }
    timestamp = request.json['timestamp']
    duration = request.json['duration']
    mongo.db.chargePointLogs.insert_one(
    {'id': chargePointId, 'Type': operation, 'timestamp' : timestamp, 'duration': duration}
    )
    socketio.emit('chargepoint_event', { 'id': chargePointId, 'latency': duration, 'type': operation})
    return {
        'status_code' : 201
    }

def check_plugin_enabled(ip: str):
    try:
        request = requests.get("http://" + ip + ":3000/status")
        return request.status_code == 200
    except:
        return False

@app.route('/chargepoint/create', methods=['POST'])
def create_charge_point(): 
    chargePointId = request.json['id']
    ip = request.json['ip']
    lastPing = request.json['lastPing']
    status = request.json['status']
    centralSystem = request.json['centralSystem']
    hasPlugin = check_plugin_enabled(ip)
    location = {'lat': 36.7150286 + (randrange(0, 10) * 0.01), 'lng': -4.4738605 +( randrange(0, 10) * 0.01)}
    # Check if charge point is already in the database
    chargepoint_count = mongo.db.chargePoints.count_documents({'id': chargePointId})
    if chargepoint_count > 0:
        return {
            'status_code' : 200
        }
    mongo.db.chargePoints.insert_one(
    {'id': chargePointId, 'ip': ip, 'lastPing' : lastPing, 'status': status , 'centralSystem': centralSystem, 'location': location, 'hasPlugin': hasPlugin}
    )
    return {
        'status_code' : 201
    }

@app.route('/chargepoint', methods=['GET'])
def get_all_charge_points():
        
    chargepoints = mongo.db.chargePoints.find().sort("_id",DESCENDING)
    return Response(
        json_util.dumps(chargepoints),
        mimetype='application/json'
    )

@app.route('/chargepoint/<chargepointId>', methods=['GET'])
def get_charge_point(chargepointId):
        
    chargepoint = mongo.db.chargePoints.find_one({"id": chargepointId})
    return Response(
        json_util.dumps(chargepoint),
        mimetype='application/json'
    )

@app.route('/chargepoint/<chargePointId>/toggle', methods=['PUT'])
def toggle_chargepoint(chargePointId):
    charge_point = mongo.db.chargePoints.find_one({'id': chargePointId})
    if charge_point == None:
        return {
            'status_code' : 200
        }
    if charge_point['status'] == 'connected':
        request = requests.delete("http://" + charge_point['ip'] + ":3000")
        if request.status_code == 200:
            print('Charge Point Disconnected')
            mongo.db.chargePoints.update_one(
            {'id': chargePointId }, { '$set': {'status': 'disconnected'}}
            )
            socketio.emit('cp_disconnect', { 'id': chargePointId})
    else:
        request = requests.post("http://" + charge_point['ip'] + ":3000")
        if request.status_code == 200:
            print('Charge Point Connected')
            mongo.db.chargePoints.update_one(
            {'id': chargePointId }, { '$set': {'status': 'connected'}}
            )
            socketio.emit('cp_connect', { 'id': chargePointId})
    return {
        'status_code' : 200
    }

@app.route('/chargepoint/<chargePointId>', methods=['PUT'])
def change_chargepoint_status(chargePointId): 
    status = request.json['status']
    # Check if charge point is already in the database
    chargepoint_count = mongo.db.chargePoints.count_documents({'id': chargePointId})
    if chargepoint_count == 0:
        return {
            'status_code' : 200
        }
    mongo.db.chargePoints.update_one(
    {'id': chargePointId }, { '$set': {'status': status}}
    )
    return {
        'status_code' : 200
    }

@app.route('/chargepoint/<chargePointId>/ping', methods=['PUT'])
def change_chargepoint_ping(chargePointId): 
    lastPing = str(time())
    # Check if charge point is already in the database
    chargepoint_count = mongo.db.chargePoints.count_documents({'id': chargePointId})
    if chargepoint_count == 0:
        return {
            'status_code' : 200
        }
    charge_point = mongo.db.chargePoints.find_one({'id': chargePointId})
    if charge_point == None or charge_point['status'] != 'connected':
        print('Charge Point is not connected')
        return {
            'status_code' : 201
        }
    mongo.db.chargePoints.update_one(
    {'id': chargePointId }, { '$set': {'lastPing': lastPing}}
    )
    return {
        'status_code' : 200
    }




@app.route('/getAllNodesId', methods=['GET'])
def get_all_nodes_id():
    currentIds = []
    for doc in mongo.db.chargePoints.find(projection = {'id': 1}):
        currentIds.append(doc['id'])
    return jsonify(currentIds)


@app.route('/user/<operation>', methods=['POST'])
def user_log(operation):
    userId = request.json['id']
    name = request.json['name']
    email = request.json['email']
    image = request.json['image']
    today = datetime.now()
    created_at = today.strftime("%H:%M:%S, %B %d, %Y")
    mongo.db.userLogs.insert_one(
    {'id': userId, 'type': operation, 'name': name, 'email': email, 'image': image, 'created_at': created_at}
    )
    socketio.emit('user_connect', {'id': userId, 'name': name, 'email': email, 'image': image })
    return {
        'status_code' : 201
    }

@app.route('/user/all', methods=['GET'])
def user_log_all():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
        
    users = mongo.db.userLogs.find().sort("_id",DESCENDING).limit(limit).skip((page-1)*limit)
    return Response(
        json_util.dumps(users),
        mimetype='application/json'
    )

@app.route('/disconnect', methods=['POST'])
def charge_point_disconnect():
    chargePointId = request.json['id']
    timestamp = request.json['timestamp']
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