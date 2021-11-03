import { Injectable } from '@angular/core';
import { generateKeyPair } from 'crypto';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
 const no1s1DataAbi = require('../../../build/contracts/no1s1data.json');
const no1s1AppAbi = require('../../../build/contracts/no1s1App.json');


@Injectable({
  providedIn: 'root'
})
export class SMCService {

  private account: any = null;
  //private accounts: any;
  private readonly web3: any;
  private enable: any;
  public no1s1:any;
  private defaultAcc:any;
  //private ethmethod:any;
  public no1s1App:any;
  public no1s1Data:any;
  public AppContractAddress = "0x23c9C6AEB8083864d89816dA91630f19EF65a09c";
  public DataContractAddress = "0x6E2E218b4d70adD2B5126B9ef0D2D08371b7bbc2";
  public AppABI = no1s1AppAbi.abi;
  public DataABI = no1s1DataAbi.abi;

  constructor() {
    //this.accounts=this.web3.eth.accounts;
    //this.ethmethod=this.web3.eth;
    //this.web3.eth.accounts.privateKeyToAccount("0xbb82dcd0ca24b981ca53b49dd9e29bebf4c9bad73ca21de136e9b806747da4a7");
    
    //this.no1s1 = new this.web3.eth.Contract(tokenAbi.abi, "0xEb109E10fAeEd051EC8d3D55Ff3A703Bfc0ec544");
   
    //this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    //this.web3 = new Web3(new Web3.providers.currentProvider);
    if (window.ethereum === 'undefined') {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.ethereum.currentProvider;
        //this.no1s1App = new this.web3.eth.Contract(no1s1AppAbi.abi, this.AppContractAddress);
        //this.no1s1Data = new this.web3.eth.Contract(no1s1DataAbi.abi, this.DataContractAddress);
      } else {
        window.alert("cannot connect to current provider!")
        //this.web3 = new Web3.providers.HttpProvider('http://localhost:8545');
        //this.no1s1App = new this.web3.eth.Contract(no1s1AppAbi.abi, this.AppContractAddress);
        //this.no1s1Data = new this.web3.eth.Contract(no1s1DataAbi.abi, this.DataContractAddress);
      }
      console.log('smc.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('smc.service :: constructor :: this.web3');
      console.log(this.DataABI);
      console.log(this.AppABI); 
      this.no1s1App = new window.web3.eth.Contract(this.AppABI, this.AppContractAddress);
      this.no1s1Data = new window.web3.eth.Contract(this.DataABI, this.DataContractAddress);
      console.log(this.no1s1App);
      console.log(this.no1s1Data); 
      this.defaultAcc="0xf86f9b72E01fa814388664dfcAeB2d8CE9740DFd";
    }
  }
  
  //*function: purchase access and deposite
  //*input: duration, user address, usernane
  //*return: the key generated based on account and username
  public buyAccess(_duration,_userName,userAcc) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.buy(_duration,_userName).send({value:'500000000000000000',from:userAcc,gas:"8721975"}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log("this is the data from service layer");
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }
  
  public getUserInfo(username_input,useraccount):Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.checkUserName(username_input).call({from:useraccount}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }


  //*function: to provide QR code contain the access key
  //*input: the key, the backend will read the provided qr code
  //*return: if corrected then door open from the back-end
  public checkAccess(_key): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.checkAccess(_key).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  // public checkUserName(_key): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.no1s1App.methods.checkUserName(_key).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
  //         if (err) {
  //           console.error(err);
  //           reject(err);
  //         }
  //         console.log(data);
  //         resolve(data);
  //     });
  //   }) as Promise<any>; 
  // }

  //*function: refund the deposit upon leaving
  //*input: user address and user name
  //*return: price of service and returned amount
  public redeemDeposit(_username): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.refundEscrow(_username).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

////////////////////////////////////////////////////////////
  public UserNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.userNumber().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  // public AccountInfoLog(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.no1s1App.methods.accountInfoLog().send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
  //       if (err) {
  //         console.error(err);
  //         reject(err);
  //       }
  //       console.log(data);
  //       resolve(data);
  //   });
  // }) as Promise<any>; 
  // }

  public newLog(_bcu,_bv,_bsoc,_pvv,_pvc,_sp,_time): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.broadcastData(_bcu,_bv,_bsoc,_pvv,_pvc,_sp,_time).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  public returnLastLog(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.checkLastTechLogs().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  public returnBalance(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.howRichAmI().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  public PeriodInfo():Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.getUsageLog().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  public whoAmI():Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1App.methods.whoAmI().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }
  
}

// public getKeyHttp() : Promise<any>{
  //   return new Promise((resolve, reject) => {
  //     this.no1s1Data.getPastEvent('newQRcode',{
  //       fromBlock:0, toBlock:'latest'
  //     }).then(function(err,event){
  //       if (err){
  //         console.log(err);
  //         reject(err);
  //       }
  //       console.log("this is event method getkey");
  //       console.log(event);
  //     })
  //   }) as Promise<any>; 
  // }

  // public getKey() : Promise<any>{
  //   return new Promise((resolve, reject) => {
  //     this.no1s1Data.events.newQRcode({
  //       fromBlock:0
  //     }, function(err,event){
  //       if (err){
  //         console.log(err);
  //         reject(err);
  //       }
  //       console.log("this is event method getkey");
  //       console.log(event)
  //     })
  //   }) as Promise<any>; 
  // }
