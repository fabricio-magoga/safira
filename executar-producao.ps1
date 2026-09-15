param(
  [int]$Porta = 3000
)

$ErrorActionPreference = "Stop"
Set-Location "C:\Users\inss\Desktop\safira"

$node = "C:\Program Files\nodejs\node.exe"
$next = "C:\Users\inss\Desktop\safira\node_modules\next\dist\bin\next"

& $node $next start --hostname 0.0.0.0 --port $Porta
