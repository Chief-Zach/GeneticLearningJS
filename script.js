import Evolution from "./Evolution.js";

export const WHITE = "rgb(255, 255, 255)"


const canvas = document.querySelector(".myCanvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const number_of_balls = 1000
const starting_moves = 500
const min_max_velocity = 5
let target = [Math.floor(Math.random() * (width - 430) + 400),
    Math.floor(Math.random() * (height - 60) + 30)]

// const target = [800, 100]
const generation_saved = 20
const best_parent_saved = 10
const mutation_rate = 5
const starting_x = width / 2
const starting_y = height / 2

let evolution = new Evolution(starting_moves, number_of_balls, [starting_x, starting_y], width, height,
    ctx, target, generation_saved, best_parent_saved, mutation_rate, min_max_velocity);

function game_loop(evolution) {
    ctx.fillStyle = "rgb(18, 18, 18)";
    ctx.fillRect(0, 0, width, height);

    // let hidden = false
    // let running = 0
    // let freeze = false


    if (!evolution.Step(false, false)) {
        console.log("Restarting")
        target = [Math.floor(Math.random() * (width - 430) + 400),
            Math.floor(Math.random() * (height - 60) + 30)]
        evolution = new Evolution(starting_moves, number_of_balls, [starting_x, starting_y], width, height,
            ctx, target, generation_saved, best_parent_saved, mutation_rate, min_max_velocity);
    }
    let test = () => {
        game_loop(evolution)
    }
    requestAnimationFrame(test)

}

game_loop(evolution)
