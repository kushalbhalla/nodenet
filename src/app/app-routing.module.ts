import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    { 
        path: 'auth', 
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
    },
    { 
        path: '', 
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
    },
    { 
        path: 'account', 
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'post', 
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'post', 
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'user-profile', loadChildren: () => import('./shared/user-profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [AuthGuard] 
    },
    { 
        path: 'search', loadChildren: () => import('./shared/search/search.module').then(m => m.SearchModule),
        canActivate: [AuthGuard] 
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}