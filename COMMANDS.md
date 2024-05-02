## Levantar 1 instancia del servidor
docker-compose up -d --build

## Levantar 3 instancias del servidor
docker-compose up -d --build --scale node=3 
OBS: se debe utilizar como archivo de configuración de nginx el archivo nginx_reverse_proxy_multiple.conf 

## Correr las pruebas de artillery para los diferentes escenarios
- sh run-scenario.sh ping api
- sh run-scenario.sh spaceflight api
- sh run-scenario.sh dictionary api
- sh run-scenario.sh dictionary-ramp api
- sh run-scenario.sh quote api