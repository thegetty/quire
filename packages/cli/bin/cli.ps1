Get-Content $PSCommandPath | Select-Object -Skip 3 | node --input-type=module - $args
exit $LastExitCode
<#
import './cli.js'
// #>
