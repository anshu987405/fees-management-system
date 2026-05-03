$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-Command($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Wait-Tcp($HostName, $Port, $Seconds) {
  $deadline = (Get-Date).AddSeconds($Seconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $client = New-Object Net.Sockets.TcpClient
      $iar = $client.BeginConnect($HostName, $Port, $null, $null)
      if ($iar.AsyncWaitHandle.WaitOne(1000, $false)) {
        $client.EndConnect($iar)
        $client.Close()
        return $true
      }
      $client.Close()
    } catch {}
    Start-Sleep -Seconds 1
  }
  return $false
}

function Ensure-EnvFiles {
  if (!(Test-Path "$Root\server\.env")) {
    Copy-Item "$Root\server\.env.example" "$Root\server\.env"
  }
  if (!(Test-Path "$Root\client\.env")) {
    Copy-Item "$Root\client\.env.example" "$Root\client\.env"
  }
}

function Ensure-Dependencies {
  if (!(Test-Path "$Root\server\node_modules")) {
    Write-Step "Installing server dependencies"
    npm.cmd install --prefix server
  }
  if (!(Test-Path "$Root\client\node_modules")) {
    Write-Step "Installing client dependencies"
    npm.cmd install --prefix client
  }
}

function Start-Mongo {
  if (Wait-Tcp "127.0.0.1" 27017 2) {
    Write-Host "MongoDB already running on 127.0.0.1:27017" -ForegroundColor Green
    return
  }

  if (Test-Command "docker") {
    Write-Step "Starting MongoDB with Docker persistent volume"
    docker compose up -d
    if (Wait-Tcp "127.0.0.1" 27017 45) { return }
  }

  $services = @("MongoDB", "MongoDB Server")
  foreach ($serviceName in $services) {
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if ($service) {
      Write-Step "Starting Windows MongoDB service"
      Start-Service $serviceName -ErrorAction SilentlyContinue
      if (Wait-Tcp "127.0.0.1" 27017 30) { return }
    }
  }

  $mongod = Get-Command "mongod" -ErrorAction SilentlyContinue
  if ($mongod) {
    Write-Step "Starting local mongod with persistent data folder"
    $dataDir = "$Root\local-mongo-data"
    if (!(Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
    Start-Process -FilePath $mongod.Source -ArgumentList @("--dbpath", $dataDir, "--bind_ip", "127.0.0.1") -WindowStyle Hidden
    if (Wait-Tcp "127.0.0.1" 27017 30) { return }
  }

  throw "MongoDB could not start. Install Docker Desktop or MongoDB Community Server once, then run this file again."
}

function Start-App {
  Write-Step "Creating admin/settings if missing"
  npm.cmd run bootstrap --prefix server

  Write-Step "Starting backend and frontend"
  Start-Process -FilePath "cmd.exe" -ArgumentList @("/k", "npm.cmd run dev --prefix server") -WorkingDirectory $Root -WindowStyle Minimized
  Start-Sleep -Seconds 3
  Start-Process -FilePath "cmd.exe" -ArgumentList @("/k", "npm.cmd run dev --prefix client") -WorkingDirectory $Root -WindowStyle Minimized

  $apiReady = Wait-Tcp "127.0.0.1" 5000 30
  $uiReady = Wait-Tcp "127.0.0.1" 5173 30

  Write-Host ""
  if ($apiReady -and $uiReady) {
    Write-Host "FeesPro is ready." -ForegroundColor Green
    Write-Host "Open: http://localhost:5173" -ForegroundColor Yellow
    $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
      Where-Object { $_.IPAddress -match "^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)" } |
      Select-Object -ExpandProperty IPAddress
    foreach ($ip in $ips) {
      Write-Host "Phone on same Wi-Fi: http://$ip`:5173" -ForegroundColor Yellow
    }
    Write-Host "Login: admin@feespro.local / Admin@12345" -ForegroundColor Yellow
    Start-Process "http://localhost:5173"
  } else {
    Write-Host "App started, but one service is still warming up." -ForegroundColor Yellow
    Write-Host "Try opening http://localhost:5173 after a few seconds."
  }
}

try {
  Write-Step "FeesPro one-click offline startup"
  Ensure-EnvFiles
  Ensure-Dependencies
  Start-Mongo
  Start-App
} catch {
  Write-Host ""
  Write-Host "Startup failed:" -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  Write-Host ""
  Write-Host "Tip: install Docker Desktop once, then run start-offline.bat again." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to close this window"
