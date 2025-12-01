from app.models import Resource
from app.extensions import db

def create_resource(data):
    allowed_fields = ['name', 'type', 'status', 'description']
    resource_data = {k: v for k, v in data.items() if k in allowed_fields}
    resource = Resource(**resource_data)
    db.session.add(resource)
    db.session.commit()
    return resource

def update_resource(resource_id, data):
    resource = Resource.query.get(resource_id)
    if not resource:
        return None
    for key, value in data.items():
        if hasattr(resource, key):
            setattr(resource, key, value)
    db.session.commit()
    return resource

def delete_resource(resource_id):
    resource = Resource.query.get(resource_id)
    if not resource:
        return None
    db.session.delete(resource)
    db.session.commit()
    return True

def list_resources(tipo=None, status=None):
    query = Resource.query
    if tipo:
        query = query.filter_by(type=tipo)
    if status:
        query = query.filter_by(status=status)
    return query.all()

def get_resources_by_type():
    return db.session.query(Resource.type, db.func.count(Resource.id)).group_by(Resource.type).all()

def get_resources_by_status():
    return db.session.query(Resource.status, db.func.count(Resource.id)).group_by(Resource.status).all()