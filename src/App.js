import {Table, Form } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';
import cryptojs from 'crypto-js';



class App extends Component 
{ 
    state = 
    {
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      txReceipt: ''   
    };
   
    captureFile =(event) => 
    {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) =>
    {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer});
    };

    onClick = async () => 
    {
      try
      {
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting..."});

        // get Transaction Receipt in console on click
        // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
          console.log(err,txReceipt);
          this.setState({txReceipt});
        }); //await for getTransactionReceipt

        await this.setState({blockNumber: this.state.txReceipt.blockNumber});
        await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
      } //try
    catch(error)
    {
      console.log(error);
    } //catch
  } //onClick

  onSubmit = async (event) => 
  {
      event.preventDefault();

      //bring in user's metamask account address
      const accounts = await web3.eth.getAccounts();
     
      console.log('Sending from Metamask account: ' + accounts[0]);

      //obtain contract address from storehash.js
      const ethAddress= await storehash.options.address;
      this.setState({ethAddress});

      //save document to IPFS,return its hash#, and set hash# to state
      //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
      await ipfs.add(this.state.buffer, (err, ipfsHash) => 
      {
        console.log(err,ipfsHash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ ipfsHash:ipfsHash[0].hash });

        //Encrypt the IPFS hash to be stored in the contract (using AES asymmetric encryption)        
        var string = this.state.ipfsHash.toString();
        let encrypted = cryptojs.AES.encrypt(string, "secrete_key").toString()
        var encoded = cryptojs.enc.Base64.parse(encrypted).toString(cryptojs.enc.Hex);

        var decoded = cryptojs.enc.Hex.parse(encoded).toString(cryptojs.enc.Base64);
        var decrypted = cryptojs.AES.decrypt(decoded, "secrete_key").toString(cryptojs.enc.Utf8);

        document.getElementById("demo1").innerHTML=encrypted;
        document.getElementById("demo2").innerHTML=decrypted;

         // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
        //return the transaction hash from the ethereum contract
        //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

        storehash.methods.sendHash(encrypted).send({
          from: accounts[0] 
        }, (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({transactionHash});
        }); //storehash 
      }) //await ipfs.add 
    }; //onSubmit 
  
    render() 
    {  
      return(
        <div className="App">
          <header className="App-header">
          </header>
          
          <hr />

        <Container>
          <h4>*IPFS network: infura.io</h4>
          <h4>*Ethereum RPC Server: HTTP://127.0.0.1:7545</h4>
          <h4>*Public Key (Account Hash): {this.state.ethAddress}</h4>
          
          <body>

          </body>

          <h3> Select a file </h3>
          <Form onSubmit={this.onSubmit}>
            <input 
              type = "file"
              onChange = {this.captureFile}
            />
             <Button 
             bsStyle="primary" 
             type="submit"> 
             Submit 
             </Button>
          </Form>

          <img src={`https:ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>

          <hr/>
            <Button onClick = {this.onClick}> Return Transaction Receipt </Button>

              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Receipt Type</th>
                    <th>Values</th>
                  </tr>
                </thead>
               
                <tbody>
                  <tr>
                    <td>IPFS Hash</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>
                  <tr>
                    <td>Encrypted IPFS Hash/Stored Hash</td>
                    <div id="demo1"></div>
                  </tr>
                  <tr>
                    <td>Testing decryption function</td>
                    <div id="demo2"></div>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.ethAddress}</td>
                  </tr>
                 
                  <tr>
                    <td>Transaction Hash</td>
                    <td>{this.state.transactionHash}</td>
                  </tr>

                  <tr>
                    <td>Block Number</td>
                    <td>{this.state.blockNumber}</td>
                  </tr>
               
                </tbody>
            </Table>
        </Container>
     </div>
      );
    } //render
}

export default App;
