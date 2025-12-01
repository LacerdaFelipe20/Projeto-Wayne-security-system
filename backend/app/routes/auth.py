from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models import User
from app import db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Email e password são necessários"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access = create_access_token(identity=str(user.id))
        refresh = create_refresh_token(identity=str(user.id))
        return jsonify({
            "message": "Login realizado com sucesso!",
            "user_id": user.id,
            "role": user.role,
            "tokens": {"access_token": access, "refresh_token": refresh}
        }), 200
    return jsonify({"message": "Credenciais inválidas"}), 401

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access = create_access_token(identity=str(identity))
    return jsonify({"access_token": new_access}), 200
