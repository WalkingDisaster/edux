import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SupportRequestComponent } from './support-request.component';
import { AuthGuard } from '../common/auth-guard.service';
import { SupportRequestItemResolverService } from './services/support-request-item-resolver.service';

import { SupportRequestListComponent } from './list/support-request-list.component';
import { SupportRequestItemComponent } from './item/support-request-item.component';

const supportRequstRoutes: Routes = [
    {
        path: 'support',
        component: SupportRequestComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: SupportRequestListComponent,
                children: [
                    {
                        path: ':id',
                        component: SupportRequestItemComponent/*,
                        resolve: {
                            supportRequest: SupportRequestItemResolverService
                        }*/
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(supportRequstRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard
    ]
})
export class SupportRequestRoutingModule { }
