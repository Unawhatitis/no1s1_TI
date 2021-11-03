import { Routes } from '@angular/router';

import { DashboardComponent } from '../examples/pages/dashboard/dashboard.component';
import { UserComponent } from '../examples/pages/user/user.component';
import { TableComponent } from '../examples/pages/table/table.component';
import { TypographyComponent } from '../examples/pages/typography/typography.component';
import { IconsComponent } from '../examples/pages/icons/icons.component';
import { MapsComponent } from '../examples/pages/maps/maps.component';
import { NotificationsComponent } from '../examples/pages/notifications/notifications.component';
import { UpgradeComponent } from '../examples/pages/upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dash',      component: DashboardComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TableComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent }
];
