import { Injectable } from '@angular/core';
const Web3 = require('web3');

declare let require: any;
declare let window: any;
const tokenAbi = require('../../../build/contracts/no1s1data.json');

@Injectable({
  providedIn: 'root'
})
export class SMCService {

  private account: any = null;
  private accounts: any;
  private readonly web3: any;
  private enable: any;
  public no1s1:any;
  private defaultAcc:any;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    this.accounts=this.web3.eth.accounts;
    this.web3.eth.accounts.privateKeyToAccount("0xec8e7c72a84150459aabbcd8157bf1088a2a7dd153929aa607bf8838590f0487");
    this.no1s1 = new this.web3.eth.Contract(tokenAbi.abi, "0x54B40cb7Cfa5485E8b4005D3Bb99CcE074DfF77a");
    this.defaultAcc="0x6415CbaE253394056A6d9889E97d08f0603171ee";
  }
  
  public registerNewUser(qusername,qcCode,qtime,quuid): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.initNewUser(qusername,qcCode,qtime,quuid).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    //   this.no1s1.methods.initNewUser(qusername,qcCode,qtime,quuid).call(null, function(err1, data1) {
    //     if (err1) {
    //       console.error(err1);
    //       reject(err1);
    //     }
    //     console.log(data1);
    //     resolve(data1);
    // });
    }) as Promise<any>; 
  }

  public newLog(_bcu,_bv,_bsoc,_pvv,_pvc,_sp,_time): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.broadcastData(_bcu,_bv,_bsoc,_pvv,_pvc,_sp,_time).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
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
      this.no1s1.methods.mylastlogs().call(function(err, data) {
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
      this.no1s1.methods.whatismybalance().call(function(err, data) {
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