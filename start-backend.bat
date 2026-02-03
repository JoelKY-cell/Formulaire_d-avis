@echo off
echo Démarrage du serveur Django...
cd /d "%~dp0"
call venv\Scripts\activate
python manage.py migrate
python manage.py runserver