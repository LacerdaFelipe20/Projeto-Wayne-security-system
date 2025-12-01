from flask import Blueprint, request, jsonify
from app.models import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    if not all(k in data for k in ("nome", "email", "password")):
        return jsonify({"message": "Dados incompletos"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email já cadastrado"}), 409

    user = User(nome=data['nome'], email=data['email'], role=data.get('role', 'user'))
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Usuário registrado com sucesso", "id": user.id}), 201

@bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    users_list = User.query.all()
    result = []
    for user in users_list:
        result.append({
            'id': user.id,
            'nome': user.nome,
            'email': user.email,
            'role': user.role
        })
    return jsonify(result), 200

@bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    requester = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Usuário não encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Usuário apagado com sucesso"}), 200
