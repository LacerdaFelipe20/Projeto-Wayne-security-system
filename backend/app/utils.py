from datetime import datetime
from flask import jsonify
import uuid

def format_datetime(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S") if dt else None

def success_response(message, data=None, status=200):
    response = {"message": message}
    if data:
        response["data"] = data
    return jsonify(response), status

def error_response(message, status=400):
    return jsonify({"error": message}), status

def generate_uuid():
    return str(uuid.uuid4())