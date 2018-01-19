import * as PIXI from "pixi.js";
import MultiStyleText from "pixi-multistyle-text";

let Container = PIXI.Container;
let autoDetectRenderer = PIXI.autoDetectRenderer;
let Graphics = PIXI.Graphics;
let Text = PIXI.Text;
let Polygon = PIXI.Polygon;

const FLAT = true;
const POINTY = false;
const OFFSET = true;
const AXIAL = false;

const newStage = (elementClass, x, y) => {
    let stage = new Container();
    let renderer = autoDetectRenderer(x, y, {antialias: true});
    document.querySelector(`.${elementClass}`).appendChild(renderer.view);

    renderer.view.style.border = "1px dashed black";
    renderer.backgroundColor = 0xFFEECC;
    stage.render = () => {
        renderer.render(stage);
    }
    stage.render();
    return stage;
}
const hex_corner = (center, size, i, flatTop) => {
    var angle_deg = 60 * i   + (flatTop ? 0 : 30)
    var angle_rad = Math.PI / 180 * angle_deg
    return [center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad)]
}

const getXYHexagon = (gridOffset, x, y, flatTop = true, offset = true) => {
    let hexagon = new Graphics();
    hexagon.beginFill(0xFFFFFF);
    // g.beginFill(0xFF9933);
    hexagon.lineStyle(1, 0x006600, 1);

    let size = 30;
    let width = size * 2;
    let height = Math.sqrt(3)/2 * width / 2;
    let horiz = (width * 3/4) / 2;
    let vert = height;

    if (!flatTop) {
        height = size * 2;
        width = Math.sqrt(3)/2 * height / 2;
        horiz = width;
        vert = (height * 3/4) / 2;
    }

    let yOffset = 0;
    let xOffset = 0;
    if (offset) {
        if (x % 2 !== 0 && flatTop) {
            yOffset = (vert / 2);
        }
        if (y % 2 !== 0 && !flatTop) {
            xOffset = (horiz / 2);
        }
    } else {

    }

    hexagon.index = {x, y}
    hexagon.x = gridOffset.x + (x * horiz) + xOffset;
    hexagon.y = gridOffset.y + (y * vert) + yOffset;

    let points = [];
    for (let i = 0; i <= 6; i++) {
        points.push(...hex_corner(hexagon,size,i, flatTop));
    };
    hexagon.drawPolygon(points)
    hexagon.endFill();

    hexagon.hitArea = new Polygon(points);
    hexagon.interactive = true;
    hexagon.click = (mouseData) => {       console.log(`MOUSE CLICK ${hexagon.index.x},${hexagon.index.y}`);    }

    let message = new MultiStyleText(
        "",
        { "default": {fontSize: "12px", fontFamily: "Arial", fill: "#000000"}, "xb": { fill: "#59b102", fontWeight: "bold"}, "yb": { fill: "#0099e6", fontWeight: "bold"} }
    );
    hexagon.message = message;
    hexagon.addChild(message);
    hexagon.addMessage = (msg) => {
        hexagon.message.text = msg;
        hexagon.message.x = hexagon.x - (message.width / 2);
        hexagon.message.y = hexagon.y - (message.height / 2);
    }
    return hexagon;
}

let stage1 = newStage("stage1", 100, 100);
let hex = getXYHexagon({x:30, y:30}, 0, 0, FLAT);
hex.addMessage(`0,0`);
stage1.addChild(hex);
stage1.render();

let stage2 = newStage("stage2", 100, 100);
let hex2 = getXYHexagon({x:30, y:30}, 0, 0, POINTY);
hex2.addMessage(`0,0`);
stage2.addChild(hex2);
stage2.render();

let stage3 = newStage("stage3", 200, 200);
for (let x = 0; x<= 2; x++) {
    for (let y = 0; y<= 2; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, FLAT);
        hex.addMessage(`${x},${y}`);
        stage3.addChild(hex);
    }
}
stage3.render();

let stage4 = newStage("stage4", 200, 200);
for (let x = 0; x<= 2; x++) {
    for (let y = 0; y<= 2; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, POINTY);
        hex.addMessage(`${x},${y}`);
        stage4.addChild(hex);
    }
}
stage4.render();


const reRenderXYHexes = (stage) => {
    console.log("Rerendering");
    stage.hexes.forEach((hex) => {
        hex.tint = "0xFFFFFF";
        let xMsg = hex.index.x;
        if (stage.selected.x == hex.index.x) {
            xMsg = `<xb>${hex.index.x}</xb>`;
            hex.tint = "0xe2e7e9";
        }
        let yMsg = hex.index.y;
        if (stage.selected.y == hex.index.y) {
            yMsg = `<yb>${hex.index.y}</yb>`;
            hex.tint = "0xdee4d7";
        }
        if (stage.selected.x == hex.index.x && stage.selected.y == hex.index.y) {
            hex.tint = "0xc3d7d0";
        }
        hex.addMessage(`${xMsg},${yMsg}`);
    })
    stage.render();
}

let stage5 = newStage("stage5", 400, 450);
stage5.selected = {}
stage5.hexes = [];
for (let x = 0; x<= 6; x++) {
    for (let y = 0; y<= 6; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, FLAT, OFFSET);
        hex.addMessage(`${x},${y}`);
        hex.mouseover = (mouseData) => {       stage5.selected = hex.index; reRenderXYHexes(stage5)    }
        stage5.hexes.push(hex);
        stage5.addChild(hex);
    }
}
stage5.render();

let stage6 = newStage("stage6", 400, 450);
stage6.selected = {}
stage6.hexes = [];
for (let x = 0; x<= 6; x++) {
    for (let y = 0; y<= 6; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, POINTY, OFFSET);
        hex.addMessage(`${x},${y}`);
        hex.mouseover = (mouseData) => {       stage6.selected = hex.index; reRenderXYHexes(stage6)    }
        stage6.hexes.push(hex);
        stage6.addChild(hex);
    }
}
stage6.render();

let stage7 = newStage("stage7", 400, 450);
stage7.selected = {}
stage7.hexes = [];
for (let x = 0; x<= 2; x++) {
    for (let y = 0; y<= 2; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, FLAT, AXIAL);
        hex.addMessage(`${x},${y}`);
        hex.mouseover = (mouseData) => {       stage7.selected = hex.index; reRenderXYHexes(stage8)    }
        stage7.hexes.push(hex);
        stage7.addChild(hex);
    }
}
stage7.render();

let stage8 = newStage("stage8", 400, 450);
stage8.selected = {}
stage8.hexes = [];
for (let x = 0; x<= 2; x++) {
    for (let y = 0; y<= 2; y++) {
        let hex = getXYHexagon({x:20, y:20}, x, y, POINTY, AXIAL);
        hex.addMessage(`${x},${y}`);
        hex.mouseover = (mouseData) => {       stage8.selected = hex.index; reRenderXYHexes(stage8)    }
        stage8.hexes.push(hex);
        stage8.addChild(hex);
    }
}
stage8.render();
