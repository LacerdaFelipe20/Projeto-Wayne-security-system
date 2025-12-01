from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Resource, User, AccessLog
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("resources", __name__, url_prefix="/resources")


def log_action(user_id, action, resource_id=None, extra=None):
    try:
        log = AccessLog(user_id=user_id, action=action)
        if extra:
            log.action = f"{action} - {extra}"
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        current_app.logger.exception("Falha ao gravar log: %s", e)
        db.session.rollback()


@bp.route("", methods=["GET"])
@jwt_required()
def list_resources():
    tipo = request.args.get("type")
    status = request.args.get("status")

    query = Resource.query
    if tipo:
        query = query.filter_by(type=tipo)
    if status:
        query = query.filter_by(status=status)

    resources = query.all()

    result = []
    for r in resources:
        result.append({
            "id": r.id,
            "name": r.name,
            "type": r.type,
            "status": r.status,
            "description": r.description
        })

    return jsonify(result), 200


@bp.route("/register", methods=["POST"])
@jwt_required()
def register_resource():

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return jsonify({"message": "Acesso negado! Apenas administradores podem registrar recursos."}), 403

    data = request.get_json() or {}
    if not all(k in data for k in ("name", "type")):
        return jsonify({"message": "Dados incompletos: 'name' e 'type' são obrigatórios."}), 400

    name = data.get("name")
    rtype = data.get("type")
    status = data.get("status", "disponível")
    description = data.get("description")

    resource = Resource(name=name, type=rtype, status=status, description=description)
    db.session.add(resource)
    db.session.commit()

    log_action(user_id, "CREATE_RESOURCE", resource_id=resource.id, extra=name)

    return jsonify({"message": "Recurso registrado com sucesso!", "id": resource.id}), 201


@bp.route("/<int:resource_id>", methods=["GET"])
@jwt_required()
def get_resource(resource_id):
    r = Resource.query.get(resource_id)
    if not r:
        return jsonify({"message": "Recurso não encontrado."}), 404

    return jsonify({
        "id": r.id,
        "name": r.name,
        "type": r.type,
        "status": r.status,
        "description": r.description
    }), 200


@bp.route("/<int:resource_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_resource(resource_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return jsonify({"message": "Acesso negado! Apenas administradores podem atualizar recursos."}), 403

    r = Resource.query.get(resource_id)
    if not r:
        return jsonify({"message": "Recurso não encontrado."}), 404

    data = request.get_json() or {}
    changed = []
    if "name" in data:
        r.name = data["name"]; changed.append("name")
    if "type" in data:
        r.type = data["type"]; changed.append("type")
    if "status" in data:
        r.status = data["status"]; changed.append("status")
    if "description" in data:
        r.description = data["description"]; changed.append("description")

    db.session.commit()
    log_action(user_id, "UPDATE_RESOURCE", resource_id=resource_id, extra=",".join(changed) if changed else None)

    return jsonify({"message": "Recurso atualizado com sucesso."}), 200


@bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or user.role != "admin":
        return jsonify({"message": "Acesso negado! Apenas administradores podem deletar recursos."}), 403

    r = Resource.query.get(resource_id)
    if not r:
        return jsonify({"message": "Recurso não encontrado."}), 404

    db.session.delete(r)
    db.session.commit()

    log_action(user_id, "DELETE_RESOURCE", resource_id=resource_id, extra=r.name)

    return jsonify({"message": "Recurso deletado com sucesso."}), 200
