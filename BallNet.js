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
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = WHITE;
        this.ctx.beginPath();
        this.ctx.arc(this.target[0], this.target[1], 20, 0, 2 * Math.PI, false);
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.font = "36px arial";
        this.ctx.strokeText(`Generation: ${generation}`, 50, 50);

        if (best_score <= this.total_moves) {
            this.ctx.strokeText(`Best Score: 0`, 50, 86);
        }
        else if (generation === 0) {
            this.ctx.strokeText(`Best Score: None`, 50, 86);
        }
        else if (best_score > this.total_moves) {
            this.ctx.strokeText(`Best Score: ${Math.round(Math.pow(best_score - this.total_moves, 1/5))}`, 50, 86);
        }


        if (best_score - this.total_moves <= 0 && best_score !== 0) {
            this.ctx.strokeText(`Best Moves: ${Math.floor(best_score)}`, 50, 122);
        }
        else {
            this.ctx.strokeText(`Best Moves: Unsolved`, 50, 122);
        }

        if (frozen) {
            this.freeze_pos()
            return 0
        }
        for (let current_ball of this.ball_list) {
            if (!current_ball.dead) {
                if (generation > 0) {
                    current_ball.pos_x += current_ball.saved_moves[move][0];
                    current_ball.pos_y += current_ball.saved_moves[move][1];
                } 
                else {
                    this.velocity = [Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity,
                                     Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity]
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
        for (let current_ball of this.ball_list) {
            current_ball.pos_x = this.start[0]
            current_ball.pos_y = this.start[1]
            current_ball.dead = false
            current_ball.best_ball = false
        }
    }
    fitness_function() {
        let distance_obj = []
        for (let ball of this.ball_list) {
            if (!ball.dead) {
                let distance = Math.pow((Math.pow(this.target[0] - ball.pos_x, 2) + (Math.pow(this.target[1] - ball.pos_y, 2))), 1/2)
                distance_obj.push(Math.pow(distance, 5) + ball.move)
            }
            else {
                distance_obj.push(Math.pow(this.width, 6))
            }
        }
        let sorted_lists = this.bubbleSort(distance_obj, this.ball_list)
        distance_obj = sorted_lists[0]
        let sorted_keys = sorted_lists[1]
        return [sorted_keys, distance_obj]
    }
    create_net() {
        for (let x=0; x < this.number_of_balls; x++) {
            this.ball_list.push(new Ball(this.ctx, this.start[0], this.start[1], ball_colours[this.generation % 6]))
        }
        console.log("Currently " + this.ball_list.length + " balls in the array")
    }
    create_ball(saved_moves) {
        this.ball_list.push(new Ball(this.ctx, this.start[0], this.start[1],
            ball_colours[this.generation % 6], saved_moves))
    }

    bubbleSort(arr, arr1){
        if (arr.length === arr1.length) {
            //Outer pass
            for (let i = 0; i < arr.length; i++) {

                //Inner pass
                for (let j = 0; j < arr.length - i - 1; j++) {

                    //Value comparison using ascending order

                    if (arr[j + 1] < arr[j]) {

                        //Swapping
                        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                        [arr1[j + 1], arr1[j]] = [arr1[j], arr1[j + 1]];

                    }
                }
            }
            return [arr, arr1];
        }
    };

}
