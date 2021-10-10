import { Component, OnInit, Renderer2, OnDestroy} from '@angular/core';
import {default as Web3} from 'web3';
import {SMCService} from '../service/smc.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import * as Rellax from 'rellax';


@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: ['./backdoor.component.css']
})
export class BackdoorComponent implements OnInit {
  data : Date = new Date();

  page = 4;
  page1 = 5;
  page2 = 3;
  focus;
  focus1;
  focus2;

  date: {year: number, month: number};
  model: NgbDateStruct;

  public isCollapsed = true;
  public isCollapsed1 = true;
  public isCollapsed2 = true;

  state_icon_primary = true;

  //////////////////////////////////////

  private web3:Web3;
  logs = {bcu:"",bv:"", bsoc:"",pvv:"",pvc:"",sp:"",time:""}
  val:number;
  dataLogged = false;
  PVvoltage:any;
  systemenergy:any;
  Bstateofcharge:any;
  //userRegistered = false;

  ///////////

  buys = {username:"",duration:""}
  usernumber:any;

  constructor(private _smcService:SMCService, private renderer : Renderer2, config: NgbAccordionConfig) {config.closeOthers = true;
    config.type = 'info'; }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
      return date.month !== current.month;
  }

  ngOnInit(): void {
    var rellaxHeader = new Rellax('.rellax-header');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('index-page');
  }
  
  logdata(event:Event):string{
    return (event.target as HTMLInputElement).value;
  }

  onLog(){
    console.log(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    console.log(this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    let that = this;
    //console.log(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    //console.log(this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    this._smcService.newLog(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time)).then(function(data){
      that.dataLogged = true;
    })
  }

  checkUsers(){
    let that = this;
    //console.log(this.usernumber);
    this._smcService.UserNumber().then(function(data){
      that.usernumber=data;
      //console.log(that.usernumber);
    })
    //console.log(this.usernumber);
  }

  // onBuy(){
  //   let that = this;
  //   console.log(this.buys.username);
  //   this._smcService.buyAccess(this.buys.duration,this.buys.username).then(function(data){
  //     //that.userbought = true;
  //     console.log(this.buys.username);
  //   })
  //   console.log(this.buys.username);
  // }
  
  lastLog(){
    let that =this;
    this._smcService.returnLastLog().then(function(data){
      that.PVvoltage=data[0];
      that.systemenergy=data[1];
      that.Bstateofcharge=data[2];
    })
  }

  onLogAccData(){
    let that = this;
    //this._smcService.AccountInfoLog().then(function(data){
    //})
  }

  whoAmI(){
    let that=this;
    this._smcService.whoAmI().then(function(data){
      console.log("who am i ")
      console.log(data)
    })

  }



  ngOnDestroy(){
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('index-page');
  }

  

}
