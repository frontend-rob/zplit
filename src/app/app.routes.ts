import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ZplitsComponent } from './features/zplits/zplits.component';
import { ContactsComponent } from './features/contacts/contacts.component';
import { GuideComponent } from './features/guide/guide.component';
import { SettingsComponent } from './features/settings/settings.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
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
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'zplits', component: ZplitsComponent },
            { path: 'contacts', component: ContactsComponent },
            { path: 'help', component: GuideComponent },
            { path: 'settings', component: SettingsComponent },

        ]
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
