"use strict";
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
let inputWeight = document.getElementById("input-weight");

cnv.height = 599;
cnv.width = 599;
//cnv.style.backgroundColor = "#b4b4b4";
//cnv.style.backgroundImage = "url(setka.png)";
cnv.style.border = "1px solid black";
// Флаг на событие ввода веса
window.isInput = false;


ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.font = "15px monospace";
ctx.textBaseline = "middle";
ctx.textAlign = "center";


const fillArc = function (x, y, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.fill();
    ctx.closePath();
}

const strokeArc = function (x, y, r, color) {
    ctx.strokeStyle = color;//#e8534f
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    ctx.stroke();
    ctx.closePath();
}

const line = function (x0, y0, x, y, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
}

const triangle = function (v1, v2, v3) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(v3.x, v3.y);
    ctx.fill();
    ctx.closePath();
};

function perpendicular(coord1, coord2, distance, position = 1) {
    // position = 1; -> bot
    // position = -1; -> top
    let a_x = coord2.x - coord1.x;
    let a_y = coord2.y - coord1.y;
    // условие перепендиклярности векторов
    let x = position * (distance / Math.sqrt(1 + (a_x / a_y) ** 2)) + coord2.x;
    let y = position * Math.sqrt(distance ** 2 - (x - coord2.x) ** 2) + coord2.y;

    if (a_x * a_y > 0) {
        x = 2 * coord2.x - x
    }
    return {x, y}
}

function division(coord1, coord2, k) {
    let x = (coord1.x + k * coord2.x) / (1 + k);
    let y = (coord1.y + k * coord2.y) / (1 + k);
    return {x, y}
}

const isCursorInNode = function (x, y, node) {
    if (((x - node.x) ** 2 + (y - node.y) ** 2) <= node.radius ** 2) {
        return true;
    }
};
// Условие килка на ребро
const isCursorInEdge = function (x, y, node) {
    let delta = 40;
    let x1 = node.x, y1 = node.y;
    //console.log(e);
    for (let i = 0; i < node.edges.length; i++) {
        let coord1 = {x: node.x, y: node.y};
        let coord2 = {x: node.edges[i].neighbour.x, y: node.edges[i].neighbour.y};
        let coord_top1 = perpendicular(coord1, coord2, 10);
        let coord_top2 = perpendicular(coord2, coord1, 10);
        // ctx.strokeStyle = "red";
        // console.log(coord_top1);
        line(0, 0, coord_top1.x, coord_top1.y);

        let x2 = node.edges[i].neighbour.x, y2 = node.edges[i].neighbour.y;

        if (Math.abs(x1 - x2) <= delta) {
            if (y < Math.max(y1, y2) - node.radius / 2 && y > Math.min(y1, y2) + node.radius / 2 &&
                x >= Math.min(x1, x2) - 8 && x <= Math.max(x1, x2) + 8) {
                //Отображение ввода для веса TODO fix
                inputWeight.style.display = "block";
                inputWeight.focus();
                inputWeight.style.top = (y1 + y2) / 2 + "px";
                inputWeight.style.left = (x1 + x2) / 2 + "px";
                window.j = i;
                return true;
            }
        }

        let k = (y2 - y1) / (x2 - x1);
        let b = (x2 * y1 - x1 * y2) / (x2 - x1);
        // TODO perpendicular
        if ((y > k * x + b - delta) && (y <= k * x + b + delta) &&
            (x >= Math.min(x1, x2) + node.radius / 2) && (x <= Math.max(x1, x2) - node.radius / 2)) {
            //Отображение ввода для веса
            inputWeight.style.display = "block";
            inputWeight.focus();
            inputWeight.style.top = (y1 + y2) / 2 + cnv.offsetTop + "px";
            inputWeight.style.left = (x1 + x2) / 2 + cnv.offsetLeft + "px";
            window.j = i;
            return true;
        }
    }
};

function contains(arr, obj) {
    for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(obj) === JSON.stringify(arr[i])) {
            return true
        }
    }
    return false
}

function isBidirectional(node1, node2) {
    let bidirectIdx = null;
    for (let i = 0; i < node2.edges.length; i++) {
        let obj1 = Object.assign({}, node1); obj1.edges = null;
        let obj2 = Object.assign({}, node2.edges[i].neighbour); obj2.edges = null;
        // console.log(obj1);
        // console.log(obj2);
        if (JSON.stringify(obj1) === JSON.stringify(obj2)){
            bidirectIdx = i;
            break;
        }
    }
    return bidirectIdx
}

const Node = function (x, y, radius, num) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.num = num;
    this.selected = false;
    this.edges = [];
    this.posX = null;
    this.posY = null;
    this.link = false;
    this.dist = "";
    this.color = "#f0f0f0";
    this.borderColor = "#000000";
    this.textColor = "#000000";

};
const Edge = function (node, dist = 1, color = "black") {
    this.neighbour = node;
    this.distance = dist;
    this.color = color;
    this.drawn = false;
};

Node.prototype = {
    draw: function () {
        fillArc(this.x, this.y, this.radius, this.color);
        strokeArc(this.x, this.y, this.radius, this.borderColor);
        ctx.fillStyle = this.textColor;
        ctx.font = "bold 15px monospace";
        ctx.fillText(this.num, this.x, this.y);
        // ctx.font = "15px monospace";
        if (this.dist) {
            ctx.fillStyle = 'red';
            ctx.font = "bold 14px monospace";
            ctx.fillText(this.dist, this.x, this.y + this.radius + 13)
        }
        ctx.font = "15px monospace";
    },
    stroke: function () {
        strokeArc(this.x, this.y, this.radius, "#e8534f");
    },
    drawLink: function () {
        for (let j = 0; j < this.edges.length; j++) {
            let bidirectIdx = isBidirectional(this, this.edges[j].neighbour);
            // console.log(bidirectIdx);
            if (bidirectIdx != null){
                console.log(this.edges[j].neighbour.edges[bidirectIdx].drawn);
                if(!this.edges[j].neighbour.edges[bidirectIdx].drawn){
                    // this.edges[j].drawn = true;
                    line(this.x, this.y, this.edges[j].neighbour.x,
                         this.edges[j].neighbour.y, this.edges[j].color);
                }
            }else{
                line(this.x, this.y, this.edges[j].neighbour.x,
                     this.edges[j].neighbour.y, this.edges[j].color);
                this.edges[j].drawn = true;
            }
            // Отображение веса ребра
            ctx.fillStyle = "black";
            let coord1 = {x: this.x, y: this.y};
            let coord2 = {
                x: this.edges[j].neighbour.x,
                y: this.edges[j].neighbour.y
            };
            let l = Math.sqrt((coord2.x - coord1.x) ** 2 + (coord2.y - coord1.y) ** 2);
            let k = (l - this.radius) / this.radius;
            let v1 = division(coord1, coord2, k);
            let v2 = {
                x: (this.x + this.edges[j].neighbour.x) / 2,
                y: (this.y + this.edges[j].neighbour.y) / 2
            };
            let v3 = division(v2, v1, 1 / 2);
            let position = 1;
            if (v3.x > v2.x) {
                position = -1
            }
            let coord = perpendicular(v2, v3, 10, position);
            ctx.font = "italic 14px monospace";
            ctx.fillText(this.edges[j].distance, coord.x, coord.y);
            ctx.font = "15px monospace";
        }

    },
    drawArrow: function (arrowHeight, arrowWidth) {
        for (let j = 0; j < this.edges.length; j++) {
            let coord1 = {x: this.x, y: this.y};
            let coord2 = {
                x: this.edges[j].neighbour.x,
                y: this.edges[j].neighbour.y
            };
            let l = Math.sqrt((coord2.x - coord1.x) ** 2 + (coord2.y - coord1.y) ** 2);
            let k = (l - this.radius) / this.radius;
            let z = (l - (this.radius + arrowHeight)) / (this.radius + arrowHeight);
            let v1 = division(coord1, coord2, k);
            let coord3 = division(coord1, coord2, z);
            let v2 = perpendicular(coord1, coord3, arrowWidth);
            let v3 = perpendicular(coord1, coord3, arrowWidth, -1);
            triangle(v1, v2, v3);
        }
    }
};

inputWeight.onchange = function () {
    node[window.i].edges[window.j].distance = Number.parseInt(this.value);
    this.style.display = "none";
    this.value = "";
};

window.onmousemove = function (e) {
    if (selectedNode) {
        selectedNode.x = e.pageX - cnv.offsetLeft;
        selectedNode.y = e.pageY - cnv.offsetTop;
    }
    if (nodeForLink && nodeForLink.link) {
        nodeForLink.posX = e.pageX - cnv.offsetLeft;
        nodeForLink.posY = e.pageY - cnv.offsetTop;
    }
};
window.onmousedown = function (e) {
    let x = e.pageX - cnv.offsetLeft, y = e.pageY - cnv.offsetTop;
    for (let i = 0; i < node.length; i++) {
        if (isCursorInNode(x, y, node[i])) {
            node[i].selected = true;
            selectedNode = node[i];
            //Соединение с выбранной вершиной
            if (nodeForLink && nodeForLink.link && (node[i].num != nodeForLink.num)) {
                nodeForLink.edges.push(new Edge(node[i]));
                nodeForLink.link = false;
                nodeForLink = null;
            }
            else if (!nodeForLink) {
                nodeForLink = node[i];
                nodeForLink.posX = x;
                nodeForLink.posY = y; //Сохранение позиции нажатия
            }
            break;
        }
    }
};
window.onmouseup = function (e) {
    if (selectedNode) {
        selectedNode.selected = false;
        selectedNode = null;
    }
    // Флаг на событие соединения вершин
    if (nodeForLink) {
        if (nodeForLink.posX == e.pageX - cnv.offsetLeft && nodeForLink.posY == e.pageY - cnv.offsetTop) {
            nodeForLink.link = true
        }
        else {
            nodeForLink.link = false;
            nodeForLink = null;
        }
    }
};
cnv.onclick = function (e) {
    let i = 0;
    let x = e.pageX - cnv.offsetLeft, y = e.pageY - cnv.offsetTop;

    for (; i < node.length; i++) {
        if (isCursorInNode(x, y, node[i])) {
            break;
        }
        if (isCursorInEdge(x, y, node[i], e)) {
            window.i = i;
            break;
        }
    }
    // Клик на пустое место
    if (i == node.length) {
        if (nodeForLink) {
            nodeForLink.link = false;
            nodeForLink = null;
        }
        else {
            node.push(new Node(x, y, 20, node.length + 1));
        }
    }
};
// Инициализация графа
let selectedNode = null;
let nodeForLink = null;
let node = [];

for (let i = 0; i < 5; i++) {
    node.push(new Node(50 + (i * 60), 50, 20, i + 1));
}
node[0].edges.push(new Edge(node[2], 2));
//node[0].edges.push(new Edge(node[3], 3));
//node[0].edges.push(new Edge(node[4], 4));

// Отрисовка редактора
function draw_red() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // Отрисовка события соединеня выбранной вершины
    if (nodeForLink && nodeForLink.link) {
        line(nodeForLink.x, nodeForLink.y, nodeForLink.posX, nodeForLink.posY);
    }
    //Отрисовка связей
    for (let i = 0; i < node.length; i++) {
        node[i].drawLink();
    }
    //Отрисовка вершин
    for (let i = 0; i < node.length; i++) {
        node[i].draw();
        if (node[i].selected) {
            node[i].stroke();
        }
    }

    // Отрисовка стрелок
    for (let i = 0; i < node.length; i++) {
        node[i].drawArrow(10, 5);
    }

    requestAnimationFrame(draw_red);
}

document.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(draw_red)
});