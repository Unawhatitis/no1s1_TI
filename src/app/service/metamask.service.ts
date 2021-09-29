import { Injectable } from '@angular/core';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
//const tokenAbi = require('../../../build/contracts/Transfer.json');
let web3;
const tokenAbi_main = require('../../../build/contracts/no1s1App.json');


@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private account: any = null;
  private web3: any;
  private enable: any;
  public transfer:any;


  constructor() {
    if (window.ethereum === 'undefined') {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.ethereum.currentProvider;
      } else {
        this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      }
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      this.enable = this.enableMetaMaskAccount();
      //this.transfer = new this.web3.eth.Contract(tokenAbi.abi, "0xeB96E7af17a71A6E869eef35e859449F751475Bc");
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = 
     //window.ethereum.enable();
      window.ethereum.request({ method: 'eth_requestAccounts' });
      
    });
    return Promise.resolve(enable);
  }

  private async getAccount(): Promise<any> {
    console.log('transfer.service :: getAccount :: start');
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        console.log('transfer.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('transfer.service :: getAccount: retAccount');
          console.log(retAccount);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('transfer.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('transfer.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }
  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();
    console.log('transfer.service :: getUserBalance :: account');
    console.log(account);
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function(err, balance) {
        console.log('transfer.service :: getUserBalance :: getBalance');
        console.log(balance);
        if (!err) {
          const retVal = {
            account: account,
            balance: balance
          };
          console.log('transfer.service :: getUserBalance :: getBalance :: retVal');
          console.log(retVal);
          resolve(retVal);
        } else {
          reject({account: 'error', balance: 0});
        }
      });
    }) as Promise<any>;
  }
//0x42845d231637b2E394A4d5ED3c9Fa31aA5e7BA4F
  
// public transferEther(value): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const that = this;
//     //const contract = require('@truffle/contract');
//     //this.transfer = contract(tokenAbi);
//     this.web3js = window.ethereum.currentProvider;
//     this.transfer= this.web3js.eth.Contract(tokenAbi);

//     // this.transfer.deployed().then(function(instance) {
//     //   return instance.pay(value.transferAddress,
//     //             {from: that.account,value: value.amount});
//     //         }).then(function(status) {
//     //           if (status) {
//     //             return resolve({status: true});
//     //           }
//     //         }).catch(function(error) {
//     //           console.log(error);
//     //           return reject('transfer.service error');
//     //         });
//     // console.log(this.transfer);
//   //   this.transfer.methods.pay(value.transferAddress).send({from:value.transferAddress,gas:"6721975"}, function(err, data) {
//   //       if (err) {
//   //         console.error(err);
//   //         reject(err);
//   //       }
//   //       console.log(data);
//   //       resolve(data);
//   //   });
//    }) as Promise<any>; 
// }


transferEther(value) {
    const that = this;
    console.log('transfer.service :: transferEther to: ' +
      value.transferAddress + ', from: ' + that.account + ', amount: ' + value.amount);
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: transferEther :: tokenAbi');
      console.log(tokenAbi_main);
      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi_main);
      this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
      console.log(that.web3);
      transferContract.setProvider(that.web3);
      console.log('transfer.service :: transferEther :: transferContract');
      console.log(transferContract);
      transferContract.deployed().then(function(instance) {
        return instance.toContract(
          //value.transferAddress,
          {
            from: that.account,
            value: value.amount
          });
      }).then(function(status) {
        if (status) {
          return resolve({status: true});
        }
      }).catch(function(error) {
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }


}