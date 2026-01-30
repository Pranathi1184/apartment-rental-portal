from flask import Flask
from extensions import db, jwt, migrate, cors
from config import Config
from auth import auth_bp
from api import api_bp
from admin_routes import admin_bp
# Import models so they are registered with SQLAlchemy
import models 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/')
    def health_check():
        return {"status": "healthy"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
