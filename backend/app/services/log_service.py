from app.models import AccessLog, User
from app import db
from datetime import datetime

def create_log(user_id: int, action: str):

    log = AccessLog(user_id=user_id, action=action, timestamp=datetime.utcnow())
    db.session.add(log)
    db.session.commit()
    return log

def get_all_logs():

    logs = AccessLog.query.order_by(AccessLog.timestamp.desc()).all()
    result = []
    for l in logs:
        result.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_nome": getattr(l.user, "nome", None) if l.user else None,
            "action": l.action,
            "timestamp": l.timestamp.isoformat()
        })
    return result
