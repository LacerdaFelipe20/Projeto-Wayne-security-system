from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Resource, AccessLog

bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@bp.route('', methods=['GET'])
@jwt_required()
def dashboard_overview():
    """
    Retorna estatísticas simples para o dashboard:
    - total_users
    - total_resources
    - recent_logs (últimos 10)
    """
    try:
        total_users = User.query.count()
        total_resources = Resource.query.count()
        recent_logs_q = AccessLog.query.order_by(AccessLog.timestamp.desc()).limit(10).all()

        recent_logs = []
        for l in recent_logs_q:
            recent_logs.append({
                "id": l.id,
                "user_id": l.user_id,
                "user_nome": getattr(l.user, "nome", None) if l.user else None,
                "action": l.action,
                "timestamp": l.timestamp.isoformat()
            })

        return jsonify({
            "total_users": total_users,
            "total_resources": total_resources,
            "recent_logs": recent_logs
        }), 200
    except Exception as e:

        return jsonify({"message": "Erro ao coletar dados do dashboard", "detail": str(e)}), 500
