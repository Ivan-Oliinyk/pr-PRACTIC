#!/bin/bash

docker stop api-cont
docker rm api-cont
docker rmi goally/api:staging
docker volume rm $(docker volume ls -qf dangling=true)
docker pull goally/api:staging
docker run --restart=unless-stopped -dit --name api-cont \
-p 3000:3000 \
goally/api:staging
docker network connect db api-cont
