import Evolution from "./Evolution.js";

export const WHITE = "rgb(255, 255, 255)"


const canvas = document.querySelector(".myCanvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const number_of_balls = 10 
const starting_moves = 200 
const min_max_velocity = 1
// const target = [random.randrange(window_w), random.randrange(window_h)]
const target = [100, 100]
const generation_saved = 10 
const best_parent_saved = 20 
const mutation_rate = 100
const starting_x = width / 2
const starting_y = height / 2

function game_loop() {
    let hidden = false
    let running = true

    let evolution = new Evolution(starting_moves, number_of_balls, [starting_x, starting_y], width, height,
        ctx, target,
        generation_saved, best_parent_saved, mutation_rate, min_max_velocity)

    while (running) {
        let freeze = false
        evolution.Step(freeze, hidden)
        running += 1
    }
    // ctx.fillStyle = "rgb(18, 18, 18)";
    // ctx.fillRect(0, 0, width, height);
// 
    // ctx.fillStyle = WHITE;
    // ctx.beginPath();
    // ctx.arc(target[0], target[1], 5, 0, 2 * Math.PI, false);
    // ctx.fill();


}

game_loop()