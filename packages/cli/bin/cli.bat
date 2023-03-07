:: /*
@echo off
more +5 %~f0 | node --input-type=module - %*
exit /b %errorlevel%
*/

import './cli.js'
