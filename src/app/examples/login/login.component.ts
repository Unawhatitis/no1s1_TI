import { Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {TransferService} from '../../service/metamask.service';
import {SMCService} from '../../service/smc.service';
import {default as Web3} from 'web3';
import { Subscription } from 'rxjs';
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
    @ViewChild("qrcode", {static : true}) qrcode: LoginComponent

    qrvalue = "https://no1s1.space";
    //********** */
    private web3:Web3;
    data : Date = new Date();
    focus;
    focus1;
    //form 
    formSubmitted = false;
    userForm: FormGroup;
    user: any;
    Bstateofcharge:any;
    Aduration:any;
    Cost:any;
    //***********duration form************//
    //select duration 
    buyDropdown = new FormControl();
    durationSelected = false;
    Duration = [5,10,20,40]
    valueSubscription: Subscription;
    selDuration : any;
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



    constructor(private _smcService:SMCService, private transferService: TransferService, private fb:FormBuilder) { } //, private fb: FormBuilder

    ngOnInit() {

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

        this.formSubmitted = false;
        this.user = {address: '', transferAddress: '', balance: '', amount: '', userName:''};//, remarks: ''
        this.getAccountAndBalance();
        // this.createForms();
        this.buyDropdown;

        let that =this;
        this._smcService.returnLastLog().then(function(data){
        that.Bstateofcharge=data[2];
        that.Aduration=data[3];
        that.Cost=data[4];
      })
    }

    //***********duration form************//




    logdata(event:Event):string{
      return (event.target as HTMLInputElement).value;
    }

    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    // createForms() {
    //   this.userForm = this.fb.group({
    //     transferAddress: new FormControl(this.user.transferAddress, Validators.compose([
    //       Validators.required,
    //       Validators.minLength(42),
    //       Validators.maxLength(42)
    //     ])),
    //     amount: new FormControl(this.user.amount, Validators.compose([
    //       Validators.required,
    //       Validators.pattern('^[+]?([.]\\d+|\\d+[.]?\\d*)$')
    //     ])),
    //     // remarks: new FormControl(this.user.remarks, Validators.compose([
    //     //   Validators.required
    //     // ]))
    //   });
    // }

    getAccountAndBalance = () => {
        const that = this;
        this.transferService.getUserBalance().
        then(function(retAccount: any) {
          that.user.address = retAccount.account;
          that.user.balance = retAccount.balance;
          console.log('transfer.components :: getAccountAndBalance :: that.user');
          console.log(that.user);
        }).catch(function(error) {
          console.log(error);
        });
      }
    
    getno1s1Account = () =>{
      const that = this;
      //this.transferService
      //to do call what is my account and then make user.transferAddress = that account.
    }

    submitForm() {
      //this.selDuration = this.buyDropdown.get('');
      //console.log(this.buyDropdown);
      this.durationSelected=true;
      //todo: add more transaction for escorn and stuff */

    }
    
    downloadQR(){
      console.log(this.qrcode);
      const parent = this.qrcode;
      //!
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
