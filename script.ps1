# Crear carpetas necesarias
New-Item -ItemType Directory -Path backend/src/Domain/AcademicPeriod -Force
New-Item -ItemType Directory -Path backend/src/Infrastructure/Repository -Force
New-Item -ItemType Directory -Path backend/src/Application/Actions/AcademicPeriod -Force

# Crear archivos de AcademicPeriod con contenido PHP inicial
Set-Content -Path backend/src/Domain/AcademicPeriod/AcademicPeriod.php -Value "<?php"
Set-Content -Path backend/src/Domain/AcademicPeriod/AcademicPeriodRepository.php -Value "<?php"

# Crear el repositorio de la base de datos
Set-Content -Path backend/src/Infrastructure/Repository/DatabaseAcademicPeriodRepository.php -Value "<?php"

# Crear archivos de acciones de AcademicPeriod con contenido PHP inicial
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/AcademicPeriodAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/ListAcademicPeriodsAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/CreateAcademicPeriodAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/UpdateAcademicPeriodAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/DeleteAcademicPeriodAction.php -Value "<?php"
Set-Content -Path backend/src/Application/Actions/AcademicPeriod/DeleteMultipleAcademicPeriodsAction.php -Value "<?php"

Write-Host "Estructura de archivos para la entidad AcademicPeriod creada exitosamente."
