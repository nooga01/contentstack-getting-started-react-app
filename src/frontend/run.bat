@ECHO off
SET requiredVersion=v16.13.0

FOR /F "tokens=* USEBACKQ" %%F IN (`node -v`) DO (
    SET currentVersion=%%F
)

CLS
ECHO.
ECHO =========================================
ECHO          CHECKING NODE VERSION 
ECHO =========================================
ECHO - Required :  %requiredVersion%
ECHO - Current  :  %currentVersion%
ECHO =========================================
IF %currentVersion% == %requiredVersion% (
    ECHO - Outcome  :  Version CORRECT 
    ECHO =========================================
    goto nodemodulescheck
) else (
    ECHO - Outcome  :  Version INCORRECT 
    ECHO =========================================
    ECHO.
    ECHO Changing to correct version of Node: %requiredVersion%
    nvm use %requiredVersion%
)


:nodemodulescheck
ECHO.  
ECHO.   
ECHO =========================================
ECHO      CHECKING 'node_modules' folder 
ECHO =========================================
if exist node_modules\ (
    ECHO - Outcome  :  Folder WAS FOUND. 
    ECHO =========================================
    goto startup
) else (
    ECHO - Outcome  :  Folder NOT FOUND.
    ECHO =========================================
    ECHO.     
    ECHO Performing "npm install"....
    timeout 1
    call npm install
)


:startup
ECHO.  
ECHO.   
ECHO =========================================
ECHO           DEVELOPMENT STARTUP 
ECHO =========================================
ECHO.

timeout 1

Echo Running Local Dev Startup Command
npm run start
