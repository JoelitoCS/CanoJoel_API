#!/bin/bash
# TEST DE REGISTRO SIN FOTO (Bash/Linux/WSL)
# Para Windows, usa PowerShell

echo "🧪 Test 1: Registro SIN foto"
echo "URL: http://localhost:3000/api/auth/registro"
echo "---"

curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: multipart/form-data" \
  -F "email=test.simple@gmail.com" \
  -F "password=123456" \
  -F "nombre=Simple Test"

echo ""
echo "✅ Si ves una respuesta con token, funcionó!"
echo "❌ Si ves error 400, verifica la consola del backend"
