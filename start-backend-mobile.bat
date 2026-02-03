@echo off
echo Démarrage du serveur Django sur toutes les interfaces...
cd /d "%~dp0"
call venv\Scripts\activate
python manage.py migrate
python manage.py runserver 0.0.0.0:8000