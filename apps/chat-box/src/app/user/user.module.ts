import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user.component';
import { Shortenstring } from '../ShortenString.pipe';

@NgModule({
  declarations: [UserComponent, Shortenstring],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  exports:[UserComponent, Shortenstring]
})
export class UserModule {}
