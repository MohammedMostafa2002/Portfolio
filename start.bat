@echo off
title Portfolio Local Server
cd /d "%~dp0"
echo Portfolio: http://localhost:8080
start "" "http://localhost:8080"
python -m http.server 8080
