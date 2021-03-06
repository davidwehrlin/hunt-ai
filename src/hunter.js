import {DynamicObject} from '/src/object.js'
import {randomSearch, greedySearch, aStarSearch, breadthFirstSearch, depthFirstSearch} from '/src/algorithm.js'

export const SEARCH = {
    RANDOM: 0,
    GREEDY: 1,
    BFS: 2,
    DFS: 3
}

export const MOVE = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

export default class Hunter extends DynamicObject {
    constructor(game, c, prey) {
        super(game, c);
        this.reset();
        this.prey = prey;
        this.scent = 0;
        this.algorithm = SEARCH.RANDOM;
        this.time = 0;
        this.minHeap = new TinyQueue([], (a,b) => {
            return a.value - b.value;
        });
        this.stack = [];
        this.queue = [];
    }

    reset() {
        this.pos = {
            x: 25,
            y: 25
        };
        this.cell = {
            row: 0,
            col: 0
        };
        this.minHeap = new TinyQueue([], (a,b) => {
            return a.value - b.value;
        });
    }

    move(cell) {
        if (cell == undefined) return;
        this.pos.x = cell.col * this.game.GRID_SIZE + this.game.GRID_SIZE / 2;
        this.pos.y = cell.row * this.game.GRID_SIZE + this.game.GRID_SIZE / 2;
        
    }

    smell(prey) {
        this.scent = Math.abs(prey.pos.x - this.pos.x); 
        this.scent += Math.abs(prey.pos.y - this.pos.y);
        return this.scent
    }

    search(deltaTime, grid) {
        switch(this.algorithm) {
            case SEARCH.RANDOM:
                return randomSearch(grid, this);
            case SEARCH.GREEDY:
                return greedySearch(grid, this, this.minHeap);
            case SEARCH.DFS:
                return depthFirstSearch(grid, this, this.stack);
            case SEARCH.BFS:
                return breadthFirstSearch(grid, this, this.queue);
        }
        return randomSearch(grid, this);
    }

    update(deltaTime, prey) {
        super.update(deltaTime);
        this.time += deltaTime;
        this.smell(prey);
        
        if (this.time > 500) {
            this.time = 0;
            let nextCell = this.search(deltaTime, this.game.board.grid);
            this.move(nextCell);
        }
        if (this.prey.checkPowerUp()) {
            this.algorithm = SEARCH.RANDOM;
        } else {
            this.algorithm = parseInt($("#algos")[0].value);
        }
        
    }
}

