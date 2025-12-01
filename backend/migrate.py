from app import create_app, db
from flask_migrate import Migrate
from flask_migrate import command
from flask.cli import ScriptInfo

app = create_app()
migrate = Migrate(app, db)


ctx = ScriptInfo(create_app=lambda: app)
    
command.migrate(ctx, message="add description to Resource")

command.upgrade(ctx)