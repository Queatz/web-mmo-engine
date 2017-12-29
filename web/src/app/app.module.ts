import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { ServerService } from './server.service';
import { WorldService } from './world.service';
import { ApiService } from './api.service';

import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectionStatusComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ServerService,
    WorldService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
