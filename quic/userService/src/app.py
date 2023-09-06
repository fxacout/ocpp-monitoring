from datetime import date
from flask import Flask, jsonify, request, Response
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import json_util

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['MONGO_URI'] = 'mongodb://mongodb:27017/user'

mongo = PyMongo(app)


@app.route('/user/<name>', methods=['PUT'])
def change_password(name):
    # Receiving Data
    password = request.json['password']
    currentUser = mongo.db.user.find_one({'name': name})
    if not currentUser:
        return {
            'status_code': 400,
            'message': 'User does not exist'
        }

    mongo.db.user.update_one(
        {'name': name},
        {'$set': {'password': password}}
    )
    return {
        'status_code': 201
    }

@app.route('/user/all', methods=['GET'])
def get_all_users():
    # Receiving Data
    users = mongo.db.user.find()
    return Response(
        json_util.dumps(users),
        mimetype='application/json'
    )

@app.route('/user/<name>', methods=['DELETE'])
def delete_user(name):
    # Receiving Data
    currentUser = mongo.db.user.find_one({'name': name})
    if not currentUser:
        return {
            'status_code': 400,
            'message': 'User does not exist'
        }

    mongo.db.user.delete_one(
        {'name': name}
    )
    return {
        'status_code': 201
    }


@app.route('/user', methods=['POST'])
def create_user():
    # Receiving Data
    email = request.json['email']
    name = request.json['name']
    image = request.json['image']
    provider = request.json['provider']
    try:
        password = request.json['password']
    except:
        password = 'Oauth'
    today = date.today()
    created_at = today.strftime("%B %d, %Y")
    currentUser = mongo.db.user.find_one({'name': name})
    if currentUser:
        if currentUser['password'] != 'Oauth':
            return {
                'status_code': 400,
                'message': 'Username already exists'
            }
        else:
            print('User already exists with Oauth')
            return {
                'status_code': 201
            }

    mongo.db.user.insert_one(
        {'email': email, 'name': name, 'password': password,
            'image': image, 'provider': provider, 'created_at': created_at}
    )
    print('User created')
    return {
        'status_code': 201
    }


@app.route('/user/<name>', methods=['GET'])
def get_user(name):
    # Receiving Data
    currentUser = mongo.db.user.find_one({'name': name})

    return Response(
        json_util.dumps(currentUser),
        mimetype='application/json'
    )


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
    socketio.run(app, debug=True, port=3000)
