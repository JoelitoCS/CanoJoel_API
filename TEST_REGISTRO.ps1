# TEST DE REGISTRO - PowerShell (Windows)

Write-Host "🧪 Test 1: Registro SIN foto" -ForegroundColor Green
Write-Host "URL: http://localhost:3000/api/auth/registro" -ForegroundColor Cyan
Write-Host "---"

# Test sin foto (formulario urlencoded)
$body = @{
    email = "test.simple$(Get-Date -Format 'yyyyMMddHHmmss')@gmail.com"
    password = "123456"
    nombre = "Test User"
}

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/registro" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body ([System.Uri]::EscapeDataString(($body.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" } | Join-String -Separator "&")))

Write-Host ""
Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 201) { 'Green' } else { 'Red' })
Write-Host "Response:" -ForegroundColor Cyan
Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3)

if ($response.StatusCode -eq 201) {
    Write-Host ""
    Write-Host "✅ ¡REGISTRO EXITOSO!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Error en registro" -ForegroundColor Red
}
