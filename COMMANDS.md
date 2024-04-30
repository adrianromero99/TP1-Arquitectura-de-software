sudo docker ps -> lista pods
sudo docker build my-node . -> build
sudo docker stop [CONTAINER ID] //stops
sudo run -p 8080:8080 my-node 

## Para correr tres instancias de node:
1. Modificar el contenido de nginx_reverse_proxy.conf con el contenido de nginx_reverse_proxy_multiple.conf 
2. Borrar la imagen de docker creada de nginx
3. Ejecutar docker compose up -d --scale node=3 

# Correr artillery para el endpoint spaceflight
sh run-scenario.sh spaceflight api