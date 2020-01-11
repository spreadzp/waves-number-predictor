import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadChildren: './pages/home/home.module#HomeModule' },
    { path: 'detail/:id', loadChildren: './pages/detail/detail.module#DetailModule' },
    { path: 'game-details/:id', loadChildren: './pages/game-details/game-details.module#GameDetailsModule' }
];

@NgModule({
  imports: [/*RouterModule.forRoot(routes)*/RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
