import os
from main import app

if __name__ == '__main__':
    # Запуск сервера на порту 5000
    app.run(host='localhost', port=5000, debug=True)
