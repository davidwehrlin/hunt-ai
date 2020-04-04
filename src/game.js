import Hunter from '/src/hunter.js';
import Board from '/src/board.js';
import Prey from '/src/prey.js';
import Controller from '/src/controller.js';

const GAMESTATE = {
    MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUILDING: 3
}



export default class Game {
    constructor (WIDTH, HEIGHT, sprites) {
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.sprites = sprites;
        this.GRID_SIZE = 50;
        this.gameState = GAMESTATE.MENU;
        
        this.board = new Board(this, sprites);
        this.hunter = new Hunter(this, "red");
        this.prey = new Prey(this, "blue");
        this.controller = new Controller(this.prey);
        
    }

    update(deltaTime) {
        switch (this.gameState) {
            case GAMESTATE.MENU:
                if (this.controller.keyState[' ']) {
                    this.gameState = GAMESTATE.PLAYING;
                }
                break;
            case GAMESTATE.BUILDING:

            case GAMESTATE.PLAYING:
                //IF DONE GO TO MENU
                if (this.controller.keyState["Escape"]) {
                    this.gameState = GAMESTATE.PAUSED;
                }
                this.board.update(deltaTime);
                this.hunter.update(deltaTime, this.prey);
                this.prey.update(deltaTime, this.controller);
                break;

            case GAMESTATE.PAUSED:
                if (this.controller.keyState[' ']) {
                    this.gameState = GAMESTATE.PLAYING;
                }
                break;
            

        }
        
    }

    draw(context) {
        switch (this.gameState) {
            case GAMESTATE.MENU:
                context.textAlign = "center";
                context.font = "50px Arial"
                context.fillText(
                    "PRESS SPACEBAR TO PLAY", 
                    400, 
                    400);
                break;
            case GAMESTATE.PLAYING:
                //TODO: DRAW MAP
                context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
                this.board.draw(context);
                this.hunter.draw(context);
                this.prey.draw(context);
                break;
            case GAMESTATE.PAUSED:
                context.textAlign = "center";
                context.font = "75px Arial";
                context.fillStyle = "RED";
                context.fillText(
                    "PAUSED", 
                    this.WIDTH / 2, 
                    this.HEIGHT / 2); 
                break;
        }
        
    }

    reset() {

    }

    start() {

    }
    
}