import { Component, OnInit} from '@angular/core';
import {default as Web3} from 'web3';
import {SMCService} from '../service/smc.service';
// import { NgModule } from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule,ReactiveFormsModule } from '@angular/forms';
// import { NouisliderModule } from 'ng2-nouislider';
// import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
// import { RouterModule } from '@angular/router';

// import { BasicelementsComponent } from '../components/basicelements/basicelements.component';
// //'../basicelements/basicelements.component';
// import { NavigationComponent } from '../components/navigation/navigation.component';
// import { TypographyComponent } from '../components/typography/typography.component';
// import { NucleoiconsComponent } from '../components/nucleoicons/nucleoicons.component';
// import { ComponentsComponent } from '../components/components.component';
// import { NotificationComponent } from '../components/notification/notification.component';
// import { NgbdModalBasic } from '../components/modal/modal.component';

@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: ['./backdoor.component.css']
})
export class BackdoorComponent implements OnInit {
  private web3:Web3;
  logs = {bcu:"",bv:"", bsoc:"",pvv:"",pvc:"",sp:"",time:""}
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
    console.log(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    console.log(this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    let that = this;
    //console.log(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time));
    //console.log(this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time)
    this._smcService.newLog(Number(this.logs.bcu),Number(this.logs.bv),Number(this.logs.bsoc),Number(this.logs.pvv),Number(this.logs.pvc),Number(this.logs.sp),Number(this.logs.time)).then(function(data){
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
