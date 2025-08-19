import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent,
        title: 'Zplit',
    },
    {
        path: 'workspace',
        component: WorkspaceComponent,
        title: 'Zplit - Workspace',
        canActivate: [authGuard]
    },
    {
        path: 'legal-notice',
        component: LegalNoticeComponent,
        title: 'Zplit - Legal Notice',
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        title: 'Zplit - Privacy Policy',
    }
];
