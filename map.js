export class Map {
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.grassTile = null;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
    }

    setViewport(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    setTileSize(size) {
        this.tileSize = size;
    }

    async loadAssets() {
        return new Promise((resolve) => {
            this.grassTile = new Image();
            this.grassTile.src = './grass_tile.png';
            this.grassTile.onload = () => {
                resolve();
            };
        });
    }

    render(ctx, cameraX, cameraY) {
        if (!this.grassTile || !this.grassTile.complete) return;

        ctx.save();
        // Translate to camera position
        // This is a simple camera that just shows the top-left of the map
        ctx.translate(-cameraX, -cameraY);

        // Calculate the total pixel size of the map
        const mapPixelWidth = this.width * this.tileSize;
        const mapPixelHeight = this.height * this.tileSize;

        // Iterate and draw grass tiles for each grid spot
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                ctx.drawImage(
                    this.grassTile,
                    i * this.tileSize,
                    j * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Subtle grid lines
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= this.width; i++) {
            const x = i * this.tileSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, mapPixelHeight);
            ctx.stroke();
        }

        // Horizontal lines
        for (let j = 0; j <= this.height; j++) {
            const y = j * this.tileSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(mapPixelWidth, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}