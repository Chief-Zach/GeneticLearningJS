import Ball, {WHITE} from "./Ball.js"

let ball_colours = ["GREEN", "RED", "ORANGE", "YELLOW", "TURQUOISE", "BLUE"]

export default class BallNet {
    constructor(number_of_balls, start, width, height, ctx, target, generation, total_moves, min_max_velocity) {
        this.generation = generation;
        this.number_of_balls = number_of_balls;
        this.ball_list = [];
        this.start = start;
        this.velocity = [0, 0];
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.dead_count = 0;
        this.target = target;
        this.total_moves = total_moves;
        this.min_max_velocity = min_max_velocity;
    }

    move(generation, move, best_score, frozen=false, hidden=false) {
        this.generation = generation;
        this.ctx.fillStyle = "rgb(18, 18, 18)";
        console.log(this.width)
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = WHITE;
        this.ctx.beginPath();
        this.ctx.arc(this.target[0], this.target[1], 5, 0, 2 * Math.PI, false);
        this.ctx.fill();

        if (frozen) {
            this.freeze_pos()
            return 0
        }
        for (let current_ball of this.ball_list) {
            if (!current_ball.dead) {
                if (0 < current_ball.saved_moves.length > move) {
                    current_ball.pos_x += current_ball.saved_moves[move][0]
                    current_ball.pos_y += current_ball.saved_moves[move][1]
                }
                else {
                    this.velocity = [Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity,
                                     Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity]
                    console.log(this.velocity)
                    current_ball.current_vector = this.velocity
                    current_ball.pos_x += this.velocity[0]
                    current_ball.pos_y += this.velocity[1]
                }
                if (current_ball.pos_x + 5 > this.width || current_ball.pos_x < 0) {
                    current_ball.kill()
                    this.dead_count += 1
                }
                else if (current_ball.pos_y + 5 > this.height || current_ball.pos_y < 0) {
                    current_ball.kill()
                    this.dead_count += 1
                }
                if (hidden && generation !== 0) {
                    if (current_ball.best_ball) {
                        current_ball.draw(current_ball.colour)
                    }
                }
                else {
                    current_ball.draw(current_ball.colour)
                }
                current_ball.move = move
            }
        }
        return this.dead_count
    }

    freeze_pos() {
        for (let current_ball of this.ball_list) {
            current_ball.draw(current_ball.colour, true)
        }
    }
    reset_pos() {
        let x = 0;
        for (let current_ball of this.ball_list) {
            current_ball.pos_x = this.start[0]
            current_ball.pos_y = this.start[1]
            current_ball.dead = false
            current_ball.best_ball = false
        }
    }
    fitness_function() {
        let distance_obj = Object.create(null)
        for (let ball of this.ball_list) {
            if (!ball.dead) {
                let distance = Math.pow((Math.pow(this.target[0] - ball.pos_x, 2) + (Math.pow(this.target[1] - ball.pos_y, 2))), 1/2)
                distance_obj[ball] = Math.pow(distance, 5) + ball.move
            }
            else {
                distance_obj[ball] = Math.pow(this.width, 6)
            }
        }
        let sorted_keys = Object.keys(distance_obj).sort(function (a,b){return distance_obj[a] - distance_obj[b]})
        return [distance_obj, sorted_keys]
    }
    create_net() {
        for (let x=0; x < this.number_of_balls; x++) {
            this.ball_list.push(new Ball(this.ctx, this.start[0], this.start[1], ball_colours[this.generation % 6]))
        }
        console.log("Currently " + this.ball_list.length + " balls in the array")
    }
    create_ball(saved_moves) {
        this.ball_list.append(new Ball(this.ctx, this.start[0], this.start[1],
            ball_colours[this.generation % 6], saved_moves))
    }
}
