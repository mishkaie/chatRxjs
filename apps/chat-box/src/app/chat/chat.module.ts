import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChatComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [],
  exports:[ChatComponent]
})
export class ChatModule {}
