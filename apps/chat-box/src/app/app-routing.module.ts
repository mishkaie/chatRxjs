import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: 'user/:id',
    component: ChatComponent,
  },
  {
    path: '',
    redirectTo: 'user/1',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'user/1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
