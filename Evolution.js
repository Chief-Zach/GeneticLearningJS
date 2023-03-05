import BallNet from "./BallNet.js"

export default class Evolution {
    constructor(moves, number_of_balls, starting_pos, width, height, ctx, target, genetics_saved, best_parent,
                mutation_rate, min_max_velocity) {
    this.generational_winners = null;
    this.saved_balls = null;
    this.generation_num = 0;
    this.number_of_balls = number_of_balls;
    this.starting_position = starting_pos;
    this.moves = moves;
    this.current_moves = 0;
    this.objects = [];
    this.distance = [];
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.target = target;
    this.genetics_saved = genetics_saved/100;
    this.mutation_rate = mutation_rate/100;
    this.best_parent = best_parent/100;
    this.min_max_velocity = min_max_velocity;
    this.balls = new BallNet(number_of_balls, [starting_pos[0], starting_pos[1]], width, height, ctx, target,
        this.generation_num, this.moves, this.min_max_velocity);
    this.balls.create_net()
    }
    Generation() {
        this.generational_winners = []
        this.saved_balls = Math.round(this.number_of_balls * this.genetics_saved)

        console.log("Saving " + this.saved_balls + " Genetics")
        this.balls = new BallNet(this.number_of_balls, [this.starting_position[0], this.starting_position[1]],
            this.width, this.height, this.ctx, this.target, this.generation_num, this.moves, this.min_max_velocity);
        
        for (let x = 0; x < this.saved_balls; x++) {
            let current_ball = this.objects[x]
            
            this.generational_winners.push(current_ball)
            if (current_ball.saved_moves.length < 1) {
                current_ball.saved_moves = current_ball.generational_moves
                current_ball.generational_moves = []
            }
        }
        this.Create_Children(this.number_of_balls - this.saved_balls)
        this.balls.ball_list = this.balls.ball_list.concat(this.generational_winners)
        console.log("Currently " + this.balls.ball_list.length + " balls in the array")
    }
    Create_Children(number_of_children) {
        let best_parents_saved = Math.round(this.best_parent * number_of_children)
        console.log("Generating Children: " + number_of_children)
        console.log("Generating Best Children: " + best_parents_saved)
        let normal = number_of_children - best_parents_saved
        console.log("Generating Normal Children: " + normal)

        for (let x=0; x<best_parents_saved; x++) {
            let past_moves = this.Mutation(this.generational_winners[0].saved_moves)

            this.balls.create_ball(past_moves)
        }
        for (let x=0; x<(number_of_children - best_parents_saved); x++) {
            this.balls.create_ball(this.Mutation(this.Crossover()))
        }
    }
    Crossover() {
        let random_num1 = Math.floor(Math.random() * (this.generational_winners.length));
        let random_num2 = Math.floor(Math.random() * (this.generational_winners.length));
        let starting_velocities = this.generational_winners[random_num1].saved_moves.slice(0 , Math.round(this.moves / 2))
        let ending_velocities = this.generational_winners[random_num2].saved_moves.slice(Math.round(this.moves / 2), )
        return starting_velocities.concat(ending_velocities)
    }
    Mutation(child) {
        let mutation_per = Math.round(this.moves * this.mutation_rate)
        for (let x of Array.from({length: mutation_per}, () => Math.round(Math.random() * (this.moves)))) {
            child[x] = [Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity,
                Math.random() * (this.min_max_velocity + this.min_max_velocity) - this.min_max_velocity]
        }
        return child
    }
    Step(frozen, hidden) {
        if (this.balls.dead_count < this.number_of_balls && this.current_moves < this.moves) {
            let value_to_pass = 2 * this.moves
            if (this.objects.length > 0) {
                value_to_pass = this.objects[0]
            }
            if (this.balls.move(Math.round(this.generation_num), this.current_moves, value_to_pass, frozen, hidden) >= this.number_of_balls)
            {
                console.log("Your ball velocity is too high!")
            }
            if (!frozen) {
                this.current_moves += 1
            }
        }
        
        else {
            let fitness_output = this.balls.fitness_function()
            this.objects = fitness_output[0]
            this.distance = fitness_output[1]
            console.log("Best Ball: " + this.objects[0])
            this.balls.reset_pos()
            this.objects[0].best_ball = true
            console.log("Generation complete")
            this.generation_num += 1
            this.balls.dead_count = 0
            this.current_moves = 0
            this.Generation()
        }
    }
}