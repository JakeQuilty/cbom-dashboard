#!/bin/bash

#THIS DOESNT WORK YET
set -e

docker-compose down

if [ -d ./db-test/data ]; then rm -Rf ./db-test/data fi
mkdir ./db-test/data
cp ../../db/db-setup/* ./db-test/db-setup

docker-compose pull
docker-compose up -d

# cp ../../db/db-setup/* ./db-test/db-setup
# docker run --rm --name=mysql-test -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -d mysql:8.0.25
# docker exec -i mysql-test mysql -uroot < 

# docker stop mysql-test
# docker rm mysql-test