const DEFAULT_SIZE = 32;
const DEFAULT_MODE = "color-mode";
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_BACKGROUND = "#000000"

const slider = document.querySelector("#slider");
const display_size_value = document.querySelector("#size-value");
const grid = document.querySelector("#grid");
const color_input = document.querySelector("#color-picker-id");
const color_button = document.querySelector("#color-mode");
const rainbow_button = document.querySelector("#rainbow-mode");
const eraser_button = document.querySelector("#eraser");
const clear_button = document.querySelector("#clear");
const fill_button = document.querySelector("#fill");

let current_color = "#ffffff";
let mouse_pressed = false;
let current_mode = DEFAULT_MODE;
let grid_len = DEFAULT_SIZE;
let fill_state_active = false;
let gridElements = [];

color_button.addEventListener("click",()=>{
    setMode("color-mode");
})
clear_button.addEventListener("click",()=>{
    resetGrid();
})
eraser_button.addEventListener("click",()=>{
    setMode("eraser")
})
rainbow_button.addEventListener("click",()=>{
    setMode("rainbow-mode");
})
fill_button.addEventListener("click",()=>{
    setFill("fill");
})
color_input.addEventListener("input",(e)=>{
    current_color = e.target.value;
});
slider.addEventListener("input",(event)=>{
    clearGrid();
    updateDisplay(event);
    setupGrid(parseInt(event.target.value, 10)); 
})
grid.addEventListener("mousedown", (e) => {
    e.preventDefault();
    mouse_pressed = true;
    colorGridElement(e.target,true);
});
grid.addEventListener("mousemove", (e) => {
    if (mouse_pressed) {
        colorGridElement(e.target,true);
    }
});
document.addEventListener("mouseup",()=>{
    mouse_pressed = false;
})
grid.addEventListener("touchstart", (e) => {
    e.preventDefault(); 
    mouse_pressed = true;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    colorGridElement(target, true);
}, { passive: false });

grid.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (mouse_pressed) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        colorGridElement(target, true);
    }
}, { passive: false });
document.addEventListener("touchend", () => {
    mouse_pressed = false;
});

function colorGridElement(target,race){
    
    if (target.classList.contains("grid-element")) {
        if(fill_state_active == true && race){
            floodFill(target.dataset.index, target.style.backgroundColor);
        }
        else if(current_mode == "rainbow-mode"){
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            target.style.backgroundColor = `rgb(${r},${g},${b})`;
        }
        else if(current_mode == "eraser"){
            target.style.backgroundColor = DEFAULT_BACKGROUND;
        }
        else{
        target.style.backgroundColor = current_color;
        }
    }
}
function floodFill(target_index, original_color) {
    if (original_color === current_color) {
        return;
    }
    let queue = [parseInt(target_index, 10)];
    let visited = new Set(queue)
    while (queue.length > 0) {
        const current_id = queue.shift();
        if (current_id < 0 || current_id >= (grid_len * grid_len)) {
            continue;
        }
        const current_target = gridElements[current_id];
        if (current_target && current_target.style.backgroundColor === original_color) {
            colorGridElement(current_target, false); ;
            const is_left_edge = current_id % grid_len === 0;
            const is_right_edge = (current_id + 1) % grid_len === 0;
            const neighbors = [];
            if (!is_left_edge) neighbors.push(current_id - 1); 
            if (!is_right_edge) neighbors.push(current_id + 1); 
            neighbors.push(current_id - grid_len); 
            neighbors.push(current_id + grid_len); 
            for (const neighbor_id of neighbors) {
                if (!visited.has(neighbor_id)) {
                    visited.add(neighbor_id);
                    queue.push(neighbor_id);
                }
            }
        }
    }
}
function setupGrid(size){
    grid_len = size;
    console.log(grid_len)
    grid.style.gridTemplateRows = `repeat(${grid_len},1fr)`;
    grid.style.gridTemplateColumns = `repeat(${grid_len},1fr)`;
    gridElements = [];
    for(let i = 0;i < grid_len * grid_len;i++){
        const grid_element = document.createElement("div");
        grid_element.dataset.index = i;
        grid_element.style.backgroundColor = DEFAULT_BACKGROUND;
        grid_element.classList.add("grid-element");
        grid.appendChild(grid_element);
         gridElements.push(grid_element);
    }
}
function resetGrid(){
    clearGrid();
    setupGrid(grid_len);
}
function clearGrid(){
    grid.innerHTML = "";
}
function updateDisplay(event){
    let val = event.target.value;
    display_size_value.textContent = `${val} x ${val}`;
}
function setMode(mode_name){
    document.querySelector(`#${current_mode}`).classList.remove("active");
    current_mode = mode_name;
    document.querySelector(`#${mode_name}`).classList.add("active");
}
function setFill(fill_state_id){
    fill_state_active = !fill_state_active;
    document.querySelector(`#${fill_state_id}`).classList.toggle("active", fill_state_active);
}
document.addEventListener('DOMContentLoaded', () => {
    clearGrid();
    gridElements = [];
    setupGrid(DEFAULT_SIZE);
    color_input.value = DEFAULT_COLOR;
    slider.value = DEFAULT_SIZE;
    display_size_value.innerHTML = `${DEFAULT_SIZE} x ${DEFAULT_SIZE}`;
    current_mode = DEFAULT_MODE;
    setMode("color-mode");
});