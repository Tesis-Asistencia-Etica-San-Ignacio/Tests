# Ejecutar y generar JSON:

artillery run scenarios/auth-load.yml \
 --config ./artillery.config.js \
 -o reports/auth-load.json

# Convertir JSON a HTML:

artillery report --output reports/auth-load.html reports/auth-load.json
