import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { TeamComponent } from './components/Team/Team.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReadMeComponent } from './components/ReadMe/ReadMe.component';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

//import { BackdoorComponent} from './backdoor/backdoor.component';
//import { TestComponent } from './test/test.component';

const routes: Routes =[
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index',                component: ComponentsComponent },
    //{ path: 'BackdoorComponent',          component: BackdoorComponent },
    { path: 'team',     component: TeamComponent },
    { path: 'registration',       component: LoginComponent },
    { path: 'aboutme',     component: ProfileComponent },
    { path: 'readme',     component: ReadMeComponent },
    //{ path: 'test',     component:TestComponent},
    { path: 'dashboard' ,  component: AdminLayoutComponent, 
    loadChildren: './admin-layout/admin-layout.module#AdminLayoutModule'},


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
