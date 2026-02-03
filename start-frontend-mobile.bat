@echo off
echo Démarrage du serveur React sur toutes les interfaces...
cd /d "%~dp0\frontend"
set HOST=0.0.0.0
npm start