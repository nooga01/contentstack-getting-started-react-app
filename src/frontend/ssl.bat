@ECHO off
CLS
ECHO.
ECHO =========================================
ECHO Starting SSL Proxy 3001 - 3000
ECHO =========================================
npx local-ssl-proxy --source 3001 --target 3000
