import { Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {TransferService} from '../../service/metamask.service';
import {SMCService} from '../../service/smc.service';
import {default as Web3} from 'web3';
import { Subscription } from 'rxjs';
import { UserComponent } from 'app/pages/user/user.component';
import {User} from './user';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
//import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[TransferService]
})
export class LoginComponent implements OnInit {
    //***qr code */
    link: string
    @ViewChild("qrcode", {static : false}) qrcode: LoginComponent
    qrvalue : any ;
    value: string;
    display = false;

    //********** */
    private web3:Web3;
    data : Date = new Date();
    focus;
    focus1;
    //** Data for **//
    Bstateofcharge:any;
    Aduration:any;
    Cost:any;
    useraccount:any;
    //*****User Form*****//
    formSubmitted = false;
    userForm: FormGroup;

    durations = [1,5,10,20,40]
    userModel = new User('no one', this.durations[0],'no one');
    nameGiven = false;

    buyDropdown = new FormControl();
    durationSelected = false;
    
    valueSubscription: Subscription;
    selDuration = this.durations[2];
    userName:any;
    pass_username :any;
    defaultqr = true;
    
    //***********duration form************//
    // accountValidationMessages = {
    //   transferAddress: [
    //     { type: 'required', message: 'Transfer Address is required' },
    //     { type: 'minLength', message: 'Transfer Address must be 42 characters long' },
    //     { type: 'maxLength', message: 'Transfer Address must be 42 characters long' }
    //   ],
    //   amount: [
    //     { type: 'required', message: 'Amount is required' },
    //     { type: 'pattern', message: 'Amount must be a positive number' }
    //   ],
    //   // remarks: [
    //   //   { type: 'required', message: 'Remarks are required' }
    //   // ]
    // };



    constructor(
      private _smcService:SMCService, 
      private transferService: TransferService, 
      private fb:FormBuilder) { } //, private fb: FormBuilder

    ngOnInit() {

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

        this.formSubmitted = false;
        this.useraccount = {address: '', transferAddress: '', balance: '', amount: '', userName:''};//, remarks: ''
        this.getAccountAndBalance();
        this.userModel = new User('',null,'')
        this.pass_username = '';
        //this.createForms();
        //this.buyDropdown;

        let that =this;
        this._smcService.returnLastLog().then(function(data){
        that.Bstateofcharge=data[2];
        that.Aduration=data[3];
        that.Cost=data[4];
      })
    }

    //GET USER ACCOUNT FROM METAMASK
    getAccountAndBalance = () => {
      const that = this;
      this.transferService.getUserBalance().
      then(function(retAccount: any) {
        that.useraccount.address = retAccount.account;
        that.useraccount.balance = retAccount.balance;
        console.log('transfer.components :: getAccountAndBalance :: that.account');
        console.log(that.useraccount);
      }).catch(function(error) {
        console.log(error);
      });
    }
    //////////////////////////////END
    
    //STEP 1 : DEPOSIT : DATA LOG && SUBMIT BUTTON
    logdata(event:Event):string{
      return (event.target as HTMLInputElement).value;
    }

    logSdata(event:Event):string{
      return (event.target as HTMLSelectElement).value;
    }
    
    //STEP 1 : transfer button submission
    onSubmit(){
      this.formSubmitted=true;
      console.log("this is values in onsubmit function:");
      console.log(this.userModel.username);
      console.log(this.userModel.duration);
      //console.log(this.userModel.key);
      this.buyUsage(this.userModel.username,this.userModel.duration)
    }

    buyUsage(start_username,start_duration){
      const that = this;
      if(!start_username || !start_duration){
        console.log("username and duration is required!")
      } else if (!that.useraccount.address){
        console.log("account is required!")
      }else{ 
        this.durationSelected=true;
        console.log("smart contract buy access starts");
        this._smcService.buyAccess(start_duration,start_username,that.useraccount.address).then(function(data){
          console.log("returned data ; compomnent level ; buy access");
          console.log(data);
          //that.qrvalue = data[0];
          //that.defaultqr = false;
        })
      }
    }

    onGenerateQR(){
      const that = this;
      that.defaultqr = false;
      console.log("on generation");
      console.log(this.userModel.usernameqr);
      this.generateQRCode(this.userModel.usernameqr)
    }
    generateQRCode(qr_username){
      const that = this;
      if(!qr_username ){
        console.log("username is required!")
      }else{
        console.log("smart contract retrive qr value starts");
        that._smcService.getUserInfo(qr_username).then(function(data){
          console.log("returned qr data ; compomnent level ; get info");
          console.log(data.qrCode);// or is this the key?? should called the key from look of smart contract
          //console.log(Web3.utils.hexToAscii(data.qrCode));
          //console.log(Web3.utils.hexToBytes(data.qrCode));
          //console.log(Web3.utils.hexToNumber(data.qrCode));
          //console.log(Web3.utils.hexToNumberString(data.qrCode));
          //console.log(Web3.utils.hexToString(data.qrCode));
          //console.log(Web3.utils.hexToUtf8(data.qrCode));
          console.log(Web3.utils.bytesToHex(data.qrCode));
          console.log(Web3.utils.asciiToHex(data.qrCode));
          console.log(Web3.utils.fromAscii(data.qrCode));

          that.qrvalue = data.qrCode;
          if(that.qrvalue == ''){
            this.display = false;
            alert("qr value null");
            return;
          }
          else{
            that.value = that.qrvalue;
            console.log(that.value);
            that.display = true;
          }
        });
      }
    }

    //////////////////////////////END

    //STEP 2 : download QR code

    downloadQR(){
      console.log(this.qrcode);
      const parent = this.qrcode;
      //@ts-ignore
      const parentElement = parent.qrcElement.nativeElement.querySelector("img").src;
      let blobData = this.convertBase64ToBlob(parentElement);
      const blob = new Blob([blobData], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Qrcode';
      link.click();
    }

    private convertBase64ToBlob(Base64Image: any) {
      // SPLIT INTO TWO PARTS
      const parts = Base64Image.split(';base64,');
      // HOLD THE CONTENT TYPE
      const imageType = parts[0].split(':')[1];
      // DECODE BASE64 STRING
      const decodedData = window.atob(parts[1]);
      // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
      const uInt8Array = new Uint8Array(decodedData.length);
      // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }
      // RETURN BLOB IMAGE AFTER CONVERSION
      return new Blob([uInt8Array], { type: imageType });
    }
    //////////////////////////////END

    //STEP 3 : Redeem the deposit
    returnDep(redeem_user){
      console.log("this is values in returnDep function:");
      console.log(redeem_user);
      const that = this; 
      if(!redeem_user){
        console.log("username is required!")
      } else if (!that.useraccount.address){
        console.log("account is required!")
      }else{ 
      this._smcService.redeemDeposit(redeem_user);
      }
    }
    //////////////////////////////END

    //STEP LAST : onDestroy
    ngOnDestroy(){
      var body = document.getElementsByTagName('body')[0];
      body.classList.remove('login-page');

      var navbar = document.getElementsByTagName('nav')[0];
      navbar.classList.remove('navbar-transparent');
  }
    //////////////////////////////END


    getno1s1Account = () =>{
      const that = this;
      //this.transferService
      //to do call what is my account and then make user.transferAddress = that account.
    }

    // createForms() {
    //   this.userForm = this.fb.group({
    //     username: new FormControl(this.userModel.username, Validators.compose([
    //       Validators.required,
    //       //Validators.minLength(42),
    //       //Validators.maxLength(42)
    //     ])),
    //     duration: new FormControl(this.userModel.duration, Validators.compose([
    //       Validators.required,
    //       //Validators.pattern('^[+]?([.]\\d+|\\d+[.]?\\d*)$')
    //     ])),
    //     // remarks: new FormControl(this.user.remarks, Validators.compose([
    //     //   Validators.required
    //     // ]))
    //   });
    // }

    //old submition form for transfer certain amount of ethereum to accounts//
    // submitForm() {
    //   if (this.userForm.invalid) {
    //     alert('transfer.components :: submitForm :: Form invalid');
    //     return;
    //   } else {
    //     console.log('transfer.components :: submitForm :: this.userForm.value');
    //     console.log(this.user.transferAddress);
    //     console.log(this.user.amount);
    //     this.transferService.transferEther(this.user).
    //     then(function() {}).catch(function(error) {
    //       console.log(error);
    //     });
    //     no1s1 0x54B40cb7Cfa5485E8b4005D3Bb99CcE074DfF77a
    //    transfer 0xD18347324a633690E554E035DaC6b34461FB3373
    //     other contract 0xb98C6bE0927883Cf54dE02472F72997811e3661b
    //   }
    // }
}
