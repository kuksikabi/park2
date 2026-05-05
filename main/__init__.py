from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Создание приложения
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app) # Разрешаем запросы от React

# Конфигурация БД (Блок 1-6)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///park.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Импорт маршрутов (views) после создания db
from main import views
