import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

import { Game } from '../../game/game';
import { WorldService } from '../world.service';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  private game: Game;

  constructor(private elementRef: ElementRef, private worldService: WorldService) { }

  ngOnInit() {
    this.game = new Game(this.elementRef.nativeElement.querySelector('#renderCanvas'), this.worldService);
  
    // Create the scene
    this.game.createScene();
  
    // start animation
    this.game.doRender();

    this.worldService.game = this.game;
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('#renderCanvas').focus();
  }

}
