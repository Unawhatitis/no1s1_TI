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
    // this.web3.eth.accounts.privateKeyToAccount("0x396b15ea86a518d9e4b882172d004404932e3c507ac0564143cb0e5153e51f41");
    this.no1s1 = new this.web3.eth.Contract(tokenAbi.abi, "0x4BA951cc71725F87dd551BA2E1dB10693219f7B3");
    this.defaultAcc=" 0x0bE66B5Db0B895b488027456c95Ac7C1ee11124c";
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

  public newLog(_bot,_bcu,_bv,_bsoc,_bcc,_bca,_pvv,_pvc,_sp,_time): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.broadcastData(_bot,_bcu,_bv,_bsoc,_bcc,_bca,_pvv,_pvc,_sp,_time).send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
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
      this.no1s1.methods.mylastlogsV().call(function(err, data) {
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