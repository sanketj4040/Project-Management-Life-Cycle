$djangoPath = "C:\Users\rajvardhan.chavan_ja\Desktop\PML MAIN\PML 5 (current working) (Final Project)\pml"
$reactPath = "C:\Users\rajvardhan.chavan_ja\Desktop\PML MAIN\PML 5 (current working) (Final Project)\pml\pml2"
$pythonExe = "C:/Users/rajvardhan.chavan_ja/AppData/Local/Programs/Python/Python313/python.exe"

Write-Host "Starting Django server..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$djangoPath'; & '$pythonExe' manage.py runserver"

Write-Host "Starting React development server..." -ForegroundColor Green
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$reactPath'; npm run dev"

Write-Host "Both servers are starting. Check the terminal windows for details." -ForegroundColor Cyan
