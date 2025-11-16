import { Player } from './player.js';
import { Map as GameMap } from './map.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.players = new Map();
        this.map = new GameMap(256, 256, 1); // Initial tile size 1, will be set correctly in resize()

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Calculate tileSize to fit 256x256 grid entirely within the viewport
        const tileSizeX = this.canvas.width / this.map.width;
        const tileSizeY = this.canvas.height / this.map.height;
        const calculatedTileSize = Math.min(tileSizeX, tileSizeY);

        this.map.setTileSize(calculatedTileSize);
        this.map.setViewport(this.canvas.width, this.canvas.height);
    }

    addOrUpdatePlayer(chatter) {
        if (!this.players.has(chatter.id)) {
            const player = new Player(chatter.id, chatter.username, chatter.color);
            this.players.set(chatter.id, player);
            console.log(`Player ${chatter.username} joined.`);
        } else {
            const player = this.players.get(chatter.id);
            player.addEnergy();
            console.log(`Player ${chatter.username} gained energy.`);
        }
    }

    start() {
        this.map.loadAssets().then(() => {
            this.lastTime = performance.now();
            this.gameLoop();
        });
    }

    gameLoop(currentTime = performance.now()) {
        const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        for (const player of this.players.values()) {
            player.update(deltaTime, this.map.width, this.map.height);
        }
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // For now, center camera on 0,0 - later can follow a player or be host-controlled
        const cameraX = 0;
        const cameraY = 0;

        this.map.render(this.ctx, cameraX, cameraY);
        
        for (const player of this.players.values()) {
            player.render(this.ctx, this.map.tileSize);
        }
    }
}