import { Component, OnInit } from '@angular/core';
import {default as Web3} from 'web3';
import {SMCService} from '../service/smc.service';

@Component({
  selector: 'app-backdoor',
  templateUrl: './backdoor.component.html',
  styleUrls: ['./backdoor.component.css']
})
export class BackdoorComponent implements OnInit {
  private web3:Web3;
  public logs = {bot:"",bcu:"",bv:"", bsoc:"",bcc:"",bca:"",pvv:"",pvc:"",sp:"",time:""}
  dataLogged = false;

  constructor(private _smcService:SMCService) { }

  ngOnInit(): void {
  }

  onLog(){
    let that = this;
    this._smcService.newLog(this.logs.bot,this.logs.bcu,this.logs.bv,this.logs.bsoc,this.logs.bcc,this.logs.bca,this.logs.pvv,this.logs.pvc,this.logs.sp,this.logs.time).then(function(data){
      that.dataLogged = true;
    })
  }

}
