# Navegar a la carpeta 'backend'
Set-Location -Path "backend"

# Crear rutas de directorio en 'src' en lugar de 'app'
$domainDir = "src/Domain/Room"
$infrastructureDir = "src/Infrastructure/Repository"
$actionsDir = "src/Application/Actions/Room"

# Crear directorios si no existen
New-Item -ItemType Directory -Force -Path $domainDir, $infrastructureDir, $actionsDir

# Función para crear archivos solo si no existen
function New-FileIfNotExists($path) {
    if (!(Test-Path -Path $path)) {
        New-Item -ItemType File -Force -Path $path | Out-Null
        Write-Host "Archivo creado: $path"
    } else {
        Write-Host "El archivo ya existe: $path"
    }
}

# Crear archivos de la entidad y el repositorio en el dominio de Room
New-FileIfNotExists (Join-Path $domainDir "Room.php")
New-FileIfNotExists (Join-Path $domainDir "RoomRepository.php")

# Crear archivo de implementación de repositorio en Infrastructure
New-FileIfNotExists (Join-Path $infrastructureDir "DatabaseRoomRepository.php")

# Crear archivos de acciones para CRUD en Application/Actions/Room
$actions = @("ListRoomsAction", "ViewRoomAction", "CreateRoomAction", "UpdateRoomAction", "DeleteRoomAction")
foreach ($action in $actions) {
    New-FileIfNotExists (Join-Path $actionsDir "$action.php")
}

Write-Host "Estructura de archivos para CRUD de Room creada exitosamente en la carpeta 'src'."
