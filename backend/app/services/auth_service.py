from flask import jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import check_password_hash
from app.models import User

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None

def generate_tokens(user_id):
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

def login_user(data):
    email = data.get("email").lower().strip()
    password = data.get("password")

    user = authenticate_user(email, password)
    if not user:
        return jsonify({"message": "Credenciais inválidas!"}), 401

    tokens = generate_tokens(user.id)
    return jsonify({
        "user_id": user.id,
        "role": user.role,
        "tokens": tokens
    }), 200

def refresh_token(identity):
    return create_refresh_token(identity=identity)
