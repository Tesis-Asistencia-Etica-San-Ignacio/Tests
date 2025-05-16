
# Convertir JSON a HTML:

artillery report --output reports/auth-load.html reports/auth-load.json

# debuguer 
$env:DEBUG = 'http:response,engine'; npx artillery run scenarios/evaluation/evaluation-load.yml

# mirarlo en la aplicacion web
npx artillery run scenarios/auth-load.yml --record --key a9_cvaks52d4nxgxemgo2lth8u2klg786ae