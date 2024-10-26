# Crear carpetas necesarias
New-Item -ItemType Directory -Path backend/src/Domain/Course -Force
New-Item -ItemType Directory -Path backend/src/Infrastructure/Repository -Force
New-Item -ItemType Directory -Path backend/src/Application/Actions/Course -Force

# Crear archivos de Course con contenido PHP inicial
Set-Content -Path backend/src/Domain/Course/Course.php -Value "<?php"
Set-Content -Path backend/src/Domain/Course/CourseRepository.php -Value "<?php"
Set-Content -Path backend/src/Infrastructure/Repository/DatabaseCourseRepository.php -Value "<?php"

# Crear archivos de acciones de Course con contenido PHP inicial
Set-Content -Path backend/src/Application/Actions/Course/ListCoursesAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/Course/CreateCourseAction.php -Value "<?php"

Write-Host "Estructura de archivos para la entidad Course creada exitosamente."
