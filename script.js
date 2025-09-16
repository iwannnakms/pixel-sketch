const DEFAULT_SIZE = 32;
const DEFAULT_MODE = "color-mode";
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_BACKGROUND =  "#000000"

const slider = document.querySelector("#slider");
const display_size_value = document.querySelector("#size-value");
const grid = document.querySelector("#grid");
const color_input = document.querySelector("#color-picker-id");
const color_button = document.querySelector("#color-mode");
const rainbow_button = document.querySelector("#rainbow-mode");
const eraser_button = document.querySelector("#eraser");
const clear_button = document.querySelector("#clear");

let current_color = "#ffffff";
let mouse_pressed = false;
let grid_let = DEFAULT_SIZE;
let current_mode = DEFAULT_MODE;
let grid_len = DEFAULT_SIZE;

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
color_input.addEventListener("input",(e)=>{
    current_color = e.target.value;
});

document.addEventListener("mouseup",()=>{
    mouse_pressed = false;
})
slider.addEventListener("input",(event)=>{
    clearGrid();
    updateDisplay(event);
    setupGrid(event.target.value);
})
grid.addEventListener("mousedown", (e) => {
    e.preventDefault();
    mouse_pressed = true;
    colorGridElement(e.target);
});
grid.addEventListener("mousemove", (e) => {
    if (mouse_pressed) {
        colorGridElement(e.target);
    }
});

function colorGridElement(target){
    if (target.classList.contains("grid-element")) {
        if(current_mode == "rainbow-mode"){
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
function setupGrid(size){
    grid_len = size;
    console.log(grid_len)
    grid.style.gridTemplateRows = `repeat(${grid_len},1fr)`;
    grid.style.gridTemplateColumns = `repeat(${grid_len},1fr)`;
    for(let i = 0;i < grid_len * grid_len;i++){
        const grid_element = document.createElement("div");
        grid_element.classList.add("grid-element");
        grid.appendChild(grid_element);
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
document.addEventListener('DOMContentLoaded', () => {
    clearGrid();
    setupGrid(DEFAULT_SIZE);
    color_input.value = DEFAULT_COLOR;
    slider.value = DEFAULT_SIZE;
    display_size_value.innerHTML = `${DEFAULT_SIZE} x ${DEFAULT_SIZE}`;
    current_mode = DEFAULT_MODE;
    setMode("color-mode");
});