from flask import Blueprint, send_from_directory, current_app

bp = Blueprint('main', __name__, url_prefix='/')

@bp.route('/')
def index():
    return send_from_directory(current_app.static_folder, 'index.html')

@bp.route('/<path:path>')
def static_proxy(path):

    return send_from_directory(current_app.static_folder, path)
