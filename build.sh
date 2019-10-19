docker-compose up -d db usersdb
cd ./reservation;
npm run build;
npm i &&
cd ..;
cd ./authentication;
npm run build;
npm i&&
cd ..;
docker-compose up;
