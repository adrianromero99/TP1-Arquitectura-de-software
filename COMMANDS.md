sudo docker ps -> lista pods
sudo docker build my-node . -> build
sudo docker stop [CONTAINER ID] //stops
sudo run -p 8080:8080 my-node 

## Para correr tres instancias de node:
1. Modificar el contenido de nginx_reverse_proxy.conf con el contenido de nginx_reverse_proxy_multiple.conf 
2. Modificar los ports en el service node a: 3000-3002:3000
3. Ejecutar docker compose up -d --scale node=3 