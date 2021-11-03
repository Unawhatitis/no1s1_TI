import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../examples/pages/dashboard/dashboard.component';
import { UserComponent }            from '../examples/pages/user/user.component';
import { TableComponent }           from '../examples/pages/table/table.component';
import { TypographyComponent }      from '../examples/pages/typography/typography.component';
import { IconsComponent }           from '../examples/pages/icons/icons.component';
import { MapsComponent }            from '../examples/pages/maps/maps.component';
import { NotificationsComponent }   from '../examples/pages/notifications/notifications.component';
import { UpgradeComponent }         from '../examples/pages/upgrade/upgrade.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
  ]
})

export class AdminLayoutModule {}
