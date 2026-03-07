<#
  MAPA MAPA — Setup completo para Windows
  Ejecutar en PowerShell:  .\setup.ps1
  Si da error de permisos:  powershell -ExecutionPolicy Bypass -File .\setup.ps1
#>

$ErrorActionPreference = "Stop"
$REQUIRED_NODE = 20

function Write-Step($num, $total, $msg) { Write-Host "`n[$num/$total] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  OK  " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Warn($msg) { Write-Host "  !!  " -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Fail($msg) { Write-Host "  X   " -ForegroundColor Red -NoNewline; Write-Host $msg }

function Test-WingetAvailable {
    return [bool](Get-Command winget -ErrorAction SilentlyContinue)
}

function Refresh-Path {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath    = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machinePath;$userPath"
}

$TOTAL = 4
$needsRestart = $false

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  MAPA MAPA — Setup del proyecto"       -ForegroundColor Cyan
Write-Host "  (Windows)"                             -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# -- 1. Git -----------------------------------------------
Write-Step 1 $TOTAL "Git..."

$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if ($gitCmd) {
    $gitVer = (git --version) -replace 'git version ', ''
    Write-Ok "Git $gitVer ya instalado"
} else {
    Write-Warn "Git no encontrado. Instalando..."

    if (Test-WingetAvailable) {
        winget install --id Git.Git --accept-source-agreements --accept-package-agreements --silent
        Refresh-Path
        $gitCmd = Get-Command git -ErrorAction SilentlyContinue
        if ($gitCmd) {
            Write-Ok "Git instalado con winget"
        } else {
            $needsRestart = $true
            Write-Warn "Git instalado pero requiere reiniciar la terminal para estar disponible"
        }
    } else {
        Write-Fail "No se pudo instalar Git automaticamente (winget no disponible)"
        Write-Host ""
        Write-Host "  Descargar manualmente desde: https://git-scm.com/download/win" -ForegroundColor Yellow
        Write-Host "  Luego volver a ejecutar este script." -ForegroundColor Yellow
        exit 1
    }
}

# -- 2. Node.js -------------------------------------------
Write-Step 2 $TOTAL "Node.js >= $REQUIRED_NODE..."

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
$nodeOk = $false

if ($nodeCmd) {
    $nodeVer = (node -v).TrimStart('v')
    $nodeMajor = [int]($nodeVer.Split('.')[0])
    if ($nodeMajor -ge $REQUIRED_NODE) {
        Write-Ok "Node.js v$nodeVer ya instalado"
        $nodeOk = $true
    } else {
        Write-Warn "Node.js v$nodeVer encontrado pero se requiere v$REQUIRED_NODE+. Actualizando..."
    }
}

if (-not $nodeOk) {
    if (Test-WingetAvailable) {
        Write-Warn "Instalando Node.js LTS con winget..."
        winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent
        Refresh-Path

        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
        if ($nodeCmd) {
            $nodeVer = (node -v).TrimStart('v')
            Write-Ok "Node.js v$nodeVer instalado con winget"
        } else {
            $needsRestart = $true
            Write-Warn "Node.js instalado pero requiere reiniciar la terminal"
        }
    } else {
        Write-Fail "No se pudo instalar Node.js automaticamente (winget no disponible)"
        Write-Host ""
        Write-Host "  Descargar manualmente desde: https://nodejs.org" -ForegroundColor Yellow
        Write-Host "  Elegir la version LTS (v$REQUIRED_NODE+)." -ForegroundColor Yellow
        Write-Host "  Luego volver a ejecutar este script." -ForegroundColor Yellow
        exit 1
    }
}

# -- Si se necesita reiniciar, parar aqui -------------------
if ($needsRestart) {
    Write-Host ""
    Write-Host "=======================================" -ForegroundColor Yellow
    Write-Host "  Se instalaron programas del sistema." -ForegroundColor Yellow
    Write-Host "  Cerrar esta terminal, abrir una nueva" -ForegroundColor Yellow
    Write-Host "  y volver a ejecutar:"                  -ForegroundColor Yellow
    Write-Host ""
    Write-Host "    .\setup.ps1"                          -ForegroundColor Cyan
    Write-Host ""
    Write-Host "=======================================" -ForegroundColor Yellow
    exit 0
}

# -- 3. npm ------------------------------------------------
Write-Step 3 $TOTAL "npm..."

$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCmd) {
    $npmVer = npm -v
    Write-Ok "npm v$npmVer"
} else {
    Write-Fail "npm no encontrado (deberia venir con Node.js)"
    Write-Host "  Reinstalar Node.js desde https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# -- 4. Dependencias del proyecto -------------------------
Write-Step 4 $TOTAL "Instalando dependencias del proyecto (npm install)..."

npm install
if ($LASTEXITCODE -eq 0) {
    Write-Ok "Todas las dependencias instaladas"
} else {
    Write-Fail "Error al instalar dependencias"
    Write-Host ""
    Write-Host "  Intentar:" -ForegroundColor Yellow
    Write-Host "    npm cache clean --force" -ForegroundColor Yellow
    Write-Host "    Remove-Item -Recurse node_modules, package-lock.json" -ForegroundColor Yellow
    Write-Host "    npm install" -ForegroundColor Yellow
    exit 1
}

# -- Resumen -----------------------------------------------
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Setup completo!"                       -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Para iniciar el servidor de desarrollo:" 
Write-Host ""
Write-Host "    npm run dev"                          -ForegroundColor Cyan
Write-Host ""
Write-Host "  El sitio estara en http://localhost:4321"
Write-Host ""
