# Backend-basic

## References

https://docs.google.com/document/d/1OQNTTYgKfpml5BCIMnXm13xbExUz_GNZ3yQ6j12f6bQ/edit

## Quick Installation

For quick installation of the repository and getting it up and running please install and run the touch.sh script which will execute all the installations, dependencies, and builds for you.

```sh
chmod +x touch.sh
./toiuch.sh
```

## Outline
The repository implements all the necessary functions of the backend for electronic medical record application on the Ethereum blockchain.

State Diagram: https://drive.google.com/file/d/1KGquiaPEDNoG-IMsYO9UrRLNCf6hfihh/view?usp=sharing

* User uploads image from frontend
* Request to Ethereum network is sent
* IPFS hash is returned to user
* The hash is encrypted and generates a transaction request
* Transaction request is processed by MetaMask
* Contract is executed on the Blockchain and stored.

The emr is sent to the IPFS in app.js, which then returns a hash that allows future access to the emr. To store this hash, the following contract is used to send IPFS hash to the blockchain. For an additional level of security, this IPFS hash is encrypted before sending it to the chain.

### Encryption:

The encryption used on the IPFS hash to ensure security of stored information is a JavaScript library crypto-js: https://www.npmjs.com/package/crypto-js .

```
npm install crypto-js
```
The explicit code: 

```js
        var string = this.state.ipfsHash.toString();
        let encrypted = cryptojs.AES.encrypt(string, "secrete_key").toString()
        var encoded = cryptojs.enc.Base64.parse(encrypted).toString(cryptojs.enc.Hex);

        var decoded = cryptojs.enc.Hex.parse(encoded).toString(cryptojs.enc.Base64);
        var decrypted = cryptojs.AES.decrypt(decoded, "secrete_key").toString(cryptojs.enc.Utf8);
```

The string of the IPFS hash is encrypted and encoded to allow for the quick conversion between the encrypted, ciphered version to the original string. The encryption scheme used is asymmetric AES encryption. The key can be changed by the user. 

### Contracts:

### StoreHash.sol
This contract takes the encrypted IPFS hash as input and stores it on the chain. The hash is encrypted before being sent to the contract using the public key. When the IPFS hash is required, the contract gets the encrypted hash, which is then decrypted in the frontend using the secret key. The solidity smart contract uses a simple input and relay function to send the necessary data to Migrations.sol. 
```sol
 function sendHash(string x) public {
   ipfsHash = x;
 }

 function getHash() public view returns (string x) {
   return ipfsHash;
 }
 ```
It is important to mention that the stored data in this smart contract is the one encrypted by the crypto-js scheme outlined.
### Migrations.sol
Processes the data sent by the storehash contract and generates a request for deployment to the blockchain. This smart contract allows for the executed contract to have all the properties of a transaction on the chain while still storing the IPFS Hash. These migrations and then returned as reciepts to the user indicating gas fees and the transaction hash. This transaction hash is important for the viewing of the uploaded data. Once this contract is executed this data appears on the chain:
https://drive.google.com/file/d/1W88UXwy4IUndyEnZXiiJ4kLpTZetsxxt/view?usp=sharing

### Frontend provided information

The intermediate frontend of the project shows the status of networks connected to as well as the values of important markers when determining the location and data inside a certain smart contract executed which is associated with a unique IPFS Hash:

https://drive.google.com/file/d/1jDABOM4TqHFt9DX6-PeANR0RC9-Nafa1/view?usp=sharing
  
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
