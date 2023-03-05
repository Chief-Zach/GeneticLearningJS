export const BLACK = "rgb(0, 0, 0)"
export const WHITE = "rgb(255, 255, 255)"
export const GREEN = "rgb(0, 255, 0)"
export const RED = "rgb(255, 0, 0)"
export const ORANGE = "rgb(255, 128, 0)"
export const YELLOW = "rgb(255, 0, 0)"
export const TURQUOISE = "rgb(0, 255, 255)"
export const BLUE = "rgb(0, 255, 255)"


export default class Ball {
    constructor(ctx, pos_x, pos_y, colour, saved_moves=[]) {
        this.pos_y = pos_y;
        this.pos_x = pos_x;
        this.ctx = ctx;
        this.dead = false;
        this.saved_moves = saved_moves;
        this.generational_moves = [];
        this.colour = colour;
        this.best_ball = false;
        this.current_vector = [];
        this.move = 0
    }
    draw(colour, frozen=false) {
        switch (colour) {
            case 'BLACK':
                colour=BLACK;
                break;
            case 'GREEN':
                colour=GREEN;
                break;
            case 'RED':
                colour=RED;
                break;
            case 'ORANGE':
                colour=ORANGE;
                break;
            case "YELLOW":
                colour = YELLOW;
                break;
            case "TURQUOISE":
                colour = TURQUOISE;
                break;
            case "BLUE":
                colour = BLUE;
                break;
        }
        if (!frozen) {
            this.generational_moves.push(this.current_vector)
        }
        this.ctx.fillStyle = colour;
        this.ctx.beginPath();
        this.ctx.arc(this.pos_x, this.pos_y, 5, 0, 2 * Math.PI, false);
        this.ctx.fill();

    }
    kill() {
        this.dead = true;
    }
}