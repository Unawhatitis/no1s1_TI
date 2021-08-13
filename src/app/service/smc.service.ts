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
    this.web3.eth.accounts.privateKeyToAccount("0xbb82dcd0ca24b981ca53b49dd9e29bebf4c9bad73ca21de136e9b806747da4a7");
    this.no1s1 = new this.web3.eth.Contract(tokenAbi.abi, "0xEb109E10fAeEd051EC8d3D55Ff3A703Bfc0ec544");
    this.defaultAcc="0x06Fa438ca3105d670C5F37Bd94113c28FE32a885";
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

  public UserNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.userNumber().call(function(err, data) {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(data);
          resolve(data);
      });
    }) as Promise<any>; 
  }

  public AccountInfoLog(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.accountInfoLog().send({from:this.defaultAcc,gas:"6721975"}, function(err, data) {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(data);
        resolve(data);
    });
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

  public PeriodInfo():Promise<any> {
    return new Promise((resolve, reject) => {
      this.no1s1.methods.periodInfo().call(function(err, data) {
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