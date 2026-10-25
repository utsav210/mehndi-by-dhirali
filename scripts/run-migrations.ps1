# PowerShell Helper to apply database migrations to Neon PostgreSQL
$envFile = Join-Path $PSScriptRoot "..\backend\.env"

if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '^DATABASE_URL=(.+)$' } | ForEach-Object {
        $env:DATABASE_URL = $matches[1].Trim()
    }
}

Write-Host "Applying database migrations to: $env:DATABASE_URL" -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "..\backend")
& ".\venv\Scripts\alembic.exe" upgrade head
Write-Host "Database migration complete!" -ForegroundColor Green
