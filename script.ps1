# Crear carpetas necesarias
New-Item -ItemType Directory -Path backend/src/Domain/Student -Force
New-Item -ItemType Directory -Path backend/src/Infrastructure/Repository -Force
New-Item -ItemType Directory -Path backend/src/Application/Actions/Student -Force

# Crear archivos de Student con contenido PHP inicial
Set-Content -Path backend/src/Domain/Student/Student.php -Value "<?php"
Set-Content -Path backend/src/Domain/Student/StudentRepository.php -Value "<?php"

# Crear el repositorio de la base de datos
Set-Content -Path backend/src/Infrastructure/Repository/DatabaseStudentRepository.php -Value "<?php"

# Crear archivos de acciones de Student con contenido PHP inicial
Set-Content -Path backend/src/Application/Actions/Student/StudentAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Student/ListStudentsAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Student/CreateStudentAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Student/UpdateStudentAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Student/DeleteStudentAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Student/DeleteMultipleStudentsAction.php -Value "<?php"

Write-Host "Estructura de archivos para la entidad Student creada exitosamente."