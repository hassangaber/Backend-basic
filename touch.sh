!#/bin/bash

git clone https://github.com/hassangaber/Backend-basic new

cd new

npm install

echo "Make sure Truffle Gananche or CLI is running."

truffle compile

truffle deploy

npm run start
