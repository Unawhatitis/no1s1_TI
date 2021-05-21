import { Component, OnInit} from '@angular/core';
import {default as Web3} from 'web3';
import {SMCService} from '../service/smc.service';

@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: ['./backdoor.component.css']
})
export class BackdoorComponent implements OnInit {
  private web3:Web3;
  logs = {bot:"",bcu:"",bv:"", bsoc:"",bcc:"",bca:"",pvv:"",pvc:"",sp:"",time:""}
  val:number;
  dataLogged = false;
  PVvoltage:any;
  systemenergy:any;
  Bstateofcharge:any;

  constructor(private _smcService:SMCService) { }

  ngOnInit(): void {
  }
  
  logdata(event:Event):string{
    return (event.target as HTMLInputElement).value;
  }

  onLog(){
    console.log(Number(this.logs.bot),Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.bcc),Number(this.logs.bca),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    console.log(this.logs.bot,this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.bcc,this.logs.bca,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    let that = this;
    console.log(that.logs.bot)
    console.log(Number(that.logs.bot),Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.bcc),Number(this.logs.bca),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    console.log(that.logs.bot,this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.bcc,this.logs.bca,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    this._smcService.newLog(Number(this.logs.bot),Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.bcc),Number(this.logs.bca),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time)).then(function(data){
      that.dataLogged = true;
    })
  }
  
  lastLog(){
    let that =this;
    this._smcService.returnLastLog().then(function(data){
      that.PVvoltage=data[0];
      that.systemenergy=data[1];
      that.Bstateofcharge=data[2];
    })
  }

  

}
