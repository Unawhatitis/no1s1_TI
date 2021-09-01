import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import 'chartjs-adapter-date-fns';
import * as moment from 'moment';
import {SMCService} from '../../service/smc.service';

@Component({
  selector: 'app-admin-layout',
  moduleId: module.id,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit {
  public menuItems: any[];
  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public batCap: any;
  accmBalance: any;
  accmUsers: any;
  public balanceArray : any[];
  public userArray : any[];
  UserArray : any[];

  constructor(private _smcService:SMCService){}

    ngOnInit() {

      this.menuItems = ROUTES.filter(menuItem => menuItem);
      this.chartColor = "#FFFFFF";

      const endDate = new Date();
      const datearray = [];
      for (let i = 0; i < 10; i++) {
        const date = moment(endDate).add(i, 'days').format('YYYY-MM-DD');
        const array = date.toString();
        datearray.push(date);
      }
      const labels = datearray.reverse();
      
      let that = this;
      this._smcService.PeriodInfo().then(function(data){
        //console.log(data);
        that.balanceArray=Array.from(data[1]);
        const new_data_balance = that.balanceArray.reverse().map((i) => Number(i));
        that.UserArray=Array.from(data[0]);
        const new_data_user = that.UserArray.reverse().map((i) => Number(i));
        that.accmBalance=new_data_balance[new_data_balance.length-1];
        that.accmUsers=new_data_user[new_data_user.length-1];
        // console.log("accumulative");
        // console.log(new_data_user, that.accmUsers);

        that.canvas = document.getElementById("chartHours");
        that.ctx = that.canvas.getContext("2d");
        const endDate = new Date();
        const datearray = [];
        for (let i = 0; i < 10; i++) {
          const date = moment(endDate).add(i, 'days').format('YYYY-MM-DD');
          const array = date.toString();
          datearray.push(date);
        }
        const labels = datearray.reverse();

        // doSomething().then((data) => {do stuff after data returns})

        // const data = await doSomething()
        // //do stuff here

  
        that.chartHours = new Chart(that.ctx, {
          type: 'line',
  
          data: {
            labels,
            datasets: [{
                borderColor: "#6bd098",
                backgroundColor: "#6bd098",
                pointRadius: 0,
                pointHoverRadius: 0,
                borderWidth: 3,
                data: [0, 100, 185, 213, 250, 268, 333, 345, 338, 354],
                //new_data_user,
                
              },
            ]
          },
          options: {
            legend: {
              display: false
            },
  
            tooltips: {
              enabled: false
            },
  
            scales: {
              yAxes: [{
  
                ticks: {
                  fontColor: "#9f9f9f",
                  beginAtZero: false,
                  maxTicksLimit: 5,
                  //padding: 20
                },
                gridLines: {
                  drawBorder: false,
                  zeroLineColor: "#ccc",
                  color: 'rgba(255,255,255,0.05)'
                }
  
              }],
  
              xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(255,255,255,0.1)',
                  zeroLineColor: "transparent",
                  display: false,
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9f9f9f"
                }
              }],
  
              x:{
                type:'timeseries',
                time:{
                  uint:'day',
                }
              },
            },
          }
        });

      var speedCanvas = document.getElementById("speedChart");
      that.ctx = that.canvas.getContext("2d");
      var dataFirst = {
        data: [0, 19, 15, 20, 30, 40, 40, 50],
        //new_data_balance, 
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      var speedData = {
        labels,
        datasets: [dataFirst]//, dataSecond]
      };

      var chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });

    })
  }
}


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard',     title: 'Data',         icon:'nc-bank',       class: '' },
  { path: '/icons',         title: 'Community',             icon:'nc-diamond',    class: '' },
  { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
];

// this.canvas = document.getElementById("chartEmail");
      // this.ctx = this.canvas.getContext("2d");
      // this.chartEmail = new Chart(this.ctx, {
      //   type: 'pie',
      //   data: {
      //     labels: [1, 2, 3],
      //     datasets: [{
      //       label: "Emails",
      //       pointRadius: 0,
      //       pointHoverRadius: 0,
      //       backgroundColor: [
      //         '#e3e3e3',
      //         '#4acccd',
      //         '#fcc468',
      //         '#ef8157'
      //       ],
      //       borderWidth: 0,
      //       data: [342, 480, 530, 120]
      //     }]
      //   },

      //   options: {

      //     legend: {
      //       display: false
      //     },

      //     pieceLabel: {
      //       render: 'percentage',
      //       fontColor: ['white'],
      //       precision: 2
      //     },

      //     tooltips: {
      //       enabled: false
      //     },

      //     scales: {
      //       yAxes: [{

      //         ticks: {
      //           display: false
      //         },
      //         gridLines: {
      //           drawBorder: false,
      //           zeroLineColor: "transparent",
      //           color: 'rgba(255,255,255,0.05)'
      //         }

      //       }],

      //       xAxes: [{
      //         barPercentage: 1.6,
      //         gridLines: {
      //           drawBorder: false,
      //           color: 'rgba(255,255,255,0.1)',
      //           zeroLineColor: "transparent"
      //         },
      //         ticks: {
      //           display: false,
      //         }
      //       }]
      //     },
      //   }
      // });