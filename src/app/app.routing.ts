import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { LandingComponent } from './examples/landing/landing.component';
import { LoginComponent } from './examples/login/login.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { ProfileRMComponent } from './examples/profile_RM/profile_RM.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { BackdoorComponent} from './backdoor/backdoor.component';
import { TestComponent } from './test/test.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';


const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent },
    { path: 'nucleoicons',          component: NucleoiconsComponent },
    { path: 'team',     component: LandingComponent },
    { path: 'registration',       component: LoginComponent },
    { path: 'aboutme',     component: ProfileComponent },
    { path: 'examples/profile_RM',     component: ProfileRMComponent },
    { path: 'readme',     component: ProfileRMComponent },
    { path: 'test',     component:TestComponent},
    { path: 'dashboard' ,  component: AdminLayoutComponent, 
    loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'},
    // component:AdminLayoutComponent, 
    // children: [
    //             {
    //             path: '',
    //             loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    //             }
    //             ]
    // },

];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
