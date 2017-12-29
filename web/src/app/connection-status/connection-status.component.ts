import { Component, OnInit } from '@angular/core';

import { ServerService } from '../server.service';

@Component({
  selector: 'connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.css']
})
export class ConnectionStatusComponent implements OnInit {

  constructor(private server: ServerService) { }

  ngOnInit() {

  }

  public status() {
    return this.server.state;
  }

}
