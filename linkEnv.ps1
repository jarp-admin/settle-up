New-Item -ItemType SymbolicLink -Target .\.env  -Path .\apps\bot\.env
New-Item -ItemType SymbolicLink -Target .\.env  -Path .\apps\web\.env
New-Item -ItemType SymbolicLink -Target .\.env  -Path .\packages\database\.env
New-Item -ItemType SymbolicLink -Target .\.env  -Path .\packages\env\.env