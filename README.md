# Backend-basic
## Outline
The repository implements all the necessary functions of the backend for electronic medical record application on the Ethereum blockchain.

State Diagram: https://drive.google.com/file/d/1KGquiaPEDNoG-IMsYO9UrRLNCf6hfihh/view?usp=sharing

* User uploads image from frontend
* Request to Ethereum network is sent
* IPFS hash is returned to user
* The hash is encrypted and generates a transaction request
* Transaction request is processed by MetaMask
* Contract is executed on the Blockchain and stored.

Main functionality:

### Upload to IPFS
The emr is sent to the IPFS in app.js, which then returns a hash that allows future access to the emr. To store this hash, the following contract is used to send IPFS hash to the blockchain. For an additional level of security, this IPFS hash is encrypted before sending it to the chain.
### Store Hash
This contract takes the encrypted IPFS hash as input and stores it on the chain. The hash is encrypted before being sent to the contract using the public key. When the IPFS hash is required, the contract gets the encrypted hash, which is then decrypted in the frontend using the secret key.

  
## Usage
Install the metamask browser extension:

Run Truffle Gananche CLI:
```
docker run --name ganache --publish 7545:8545 trufflesuite/ganache-cli:latest
```


Ensure NPM is updated to the latest version:

```
hassan@Hassans-MacBook-Pro ~ % npm -v
7.12.1
```

Then clone the repository:
```
git clone https://github.com/hassangaber/Backend-basic.git EMR
```
Once you have entered the EMR directory:
```
npm install
```
Then the contracts must be executed on the Blockchain:
```
hassan@Hassans-MacBook-Pro new % truffle compile
hassan@Hassans-MacBook-Pro new % truffle deploy
```
Now, run the application:
```
npm run start
```