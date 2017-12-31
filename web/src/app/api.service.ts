import { Injectable } from '@angular/core';

import { ServerService } from './server.service';

@Injectable()
export class ApiService {

  constructor(private server: ServerService) { }

}
