# Crear carpetas necesarias
New-Item -ItemType Directory -Path backend/src/Domain/Semester -Force
New-Item -ItemType Directory -Path backend/src/Infrastructure/Repository -Force
New-Item -ItemType Directory -Path backend/src/Application/Actions/Semester -Force

# Crear archivos de Semester con contenido PHP inicial
Set-Content -Path backend/src/Domain/Semester/Semester.php -Value "<?php"
Set-Content -Path backend/src/Domain/Semester/SemesterRepository.php -Value "<?php"

# Crear el repositorio de la base de datos
Set-Content -Path backend/src/Infrastructure/Repository/DatabaseSemesterRepository.php -Value "<?php"

# Crear archivos de acciones de Semester con contenido PHP inicial
Set-Content -Path backend/src/Application/Actions/Semester/SemesterAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Semester/ListSemestersAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Semester/CreateSemesterAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Semester/UpdateSemesterAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Semester/DeleteSemesterAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Semester/DeleteMultipleSemestersAction.php -Value "<?php"


Write-Host "Estructura de archivos para la entidad Semester creada exitosamente."
