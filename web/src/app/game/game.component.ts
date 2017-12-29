import { Component, OnInit, ElementRef } from '@angular/core';

import { Game } from '../../game/game';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    let game = new Game(this.elementRef.nativeElement.querySelector('#renderCanvas'));
  
    // Create the scene
    game.createScene();
  
    // start animation
    game.doRender();
  }

}
