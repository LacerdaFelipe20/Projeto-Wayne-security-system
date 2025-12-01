from flask import Blueprint, jsonify, request
from app import db
from app.models import AccessLog, User

bp = Blueprint("logs", __name__, url_prefix="/logs")

@bp.route("", methods=["GET"])
def get_logs():
    
    usuario_q = request.args.get("usuario")
    limit = request.args.get("limit", type=int) or 100

    query = db.session.query(AccessLog).join(User)

    if usuario_q:
        q = f"%{usuario_q.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(User.nome).like(q),
                db.func.lower(User.email).like(q)
            )
        )

    logs = query.order_by(AccessLog.timestamp.desc()).limit(limit).all()

    result = []
    for l in logs:
        result.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_name": getattr(l.user, "nome", None),
            "action": l.action,
            "timestamp": l.timestamp.isoformat() if l.timestamp else None
        })

    return jsonify(result), 200
