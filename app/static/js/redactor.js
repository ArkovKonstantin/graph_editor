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
ctx.textBaseline="middle";
ctx.textAlign = "center";


const fillArc = function (x, y, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.fill();
    ctx.closePath();
}

const strokeArc = function (x, y, r, color) {
    ctx.strokeStyle = color;//#e8534f
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
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

const isCursorInNode = function(x, y, node){
    if (((x-node.x)**2 + (y-node.y)**2) <= node.radius**2){
        return true;
    }
}
const isCursorInEdge = function(x, y, node){
    let delta = 40;
    let x1 = node.x, y1 = node.y;
    //console.log(e);
    for (let i = 0; i < node.edges.length; i++){
        let x2 = node.edges[i].neighbour.x, y2 = node.edges[i].neighbour.y;
        if (Math.abs(x1 - x2) <= delta){
            if (y < Math.max(y1, y2)-node.radius/2 && y > Math.min(y1, y2)+node.radius/2 && 
            x >= Math.min(x1, x2)-8 && x <= Math.max(x1, x2)+8){
                //Отображение ввода для веса
                inputWeight.style.display = "block";
                inputWeight.focus();
                inputWeight.style.top = (y1+y2)/2 + "px";
                inputWeight.style.left = (x1+x2)/2+ "px";
                window.j = i;
                return true;
            }
        }
        let k = (y2-y1)/(x2-x1);
        let b = (x2*y1-x1*y2)/(x2-x1);
        if ((y > k*x + b - delta) && (y <= k*x + b + delta) && 
        (x >= Math.min(x1, x2) + node.radius/2) && (x <= Math.max(x1, x2)-node.radius/2)){
            //Отображение ввода для веса
            inputWeight.style.display = "block";
            inputWeight.focus();
            inputWeight.style.top = (y1+y2)/2 + cnv.offsetTop + "px";
            inputWeight.style.left = (x1+x2)/2 + cnv.offsetLeft + "px";
            window.j = i;
            return true;
        }
    }   
}

const Node = function (x, y, radius, num){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.num = num;
    this.selected = false;
    this.edges = [];
    this.posX = null;
    this.posY = null;
    this.link = false;
    this.dist = Infinity;
    this.color = "#f0f0f0"; 
}
const Edge = function(node, dist = 1, color = "black"){
    this.neighbour = node;
    this.distance = dist;
    this.color = color;
}

Node.prototype = {
    draw : function(){
        fillArc(this.x, this.y, this.radius, this.color);
        strokeArc(this.x, this.y, this.radius, "black");
        ctx.fillStyle = "black";
        ctx.font = "bold 15px monospace";
        ctx.fillText(this.num, this.x, this.y);
        ctx.font = "15px monospace";
    },
    stroke : function(){
        strokeArc(this.x, this.y, this.radius, "#e8534f");
    },
    drawLink: function(){
        for (let j = 0; j < this.edges.length; j++) {
            line(this.x, this.y, this.edges[j].neighbour.x, this.edges[j].neighbour.y, this.edges[j].color);
            // Отображение веса ребра
            ctx.fillStyle = "black";

            let d = 15;
            let x1 = (this.x + this.edges[j].neighbour.x)/2;
            let y1 = (this.y + this.edges[j].neighbour.y)/2;
            
            let a_x = x1 - this.x;
            let a_y = y1 - this.y;
            
            let x2 = (d / Math.sqrt(1 + (a_x/a_y)**2)) + x1;
            let y2 = Math.sqrt(d**2 - (x2-x1)**2) + y1;

            if (a_x*a_y > 0){
                x2 = 2*x1 - x2;
            }
            ctx.fillText(this.edges[j].distance, x2, y2);   

        }
    },   
}

inputWeight.onchange = function(){
    node[window.i].edges[window.j].distance = Number.parseInt(this.value);
    this.style.display = "none";
    this.value = "";
}

window.onmousemove = function(e){
    if (selectedNode){
        selectedNode.x = e.pageX - cnv.offsetLeft;
        selectedNode.y = e.pageY - cnv.offsetTop;
    }
    if (nodeForLink && nodeForLink.link){
        nodeForLink.posX = e.pageX - cnv.offsetLeft;
        nodeForLink.posY = e.pageY - cnv.offsetTop;
    }
}
window.onmousedown = function(e){
    let x = e.pageX - cnv.offsetLeft, y = e.pageY - cnv.offsetTop;
    for (let i = 0; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){
            node[i].selected = true;
            selectedNode = node[i];
            //Соединение с выбранной вершиной
            if (nodeForLink && nodeForLink.link && (node[i].num != nodeForLink.num)){
                nodeForLink.edges.push(new Edge(node[i]));
                nodeForLink.link = false;
                nodeForLink = null;
            }
            else if(!nodeForLink){
                nodeForLink = node[i]
                nodeForLink.posX = x; nodeForLink.posY = y; //Сохранение позиции нажатия
            }
            break;
        }
    }
}
window.onmouseup = function(e){
    if (selectedNode){
        selectedNode.selected = false;
        selectedNode = null;
    }
    // Флаг на событие соединения вершин
    if (nodeForLink){
        if (nodeForLink.posX == e.pageX - cnv.offsetLeft && nodeForLink.posY == e.pageY - cnv.offsetTop){
            nodeForLink.link = true
        }
        else{
            nodeForLink.link = false;
            nodeForLink = null;
        }
    }
    
}

cnv.onclick = function(e){
    let i = 0;
    let x = e.pageX - cnv.offsetLeft, y = e.pageY - cnv.offsetTop;
    
    for (; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){    
            break;
        }
        if (isCursorInEdge(x, y, node[i], e)){
            window.i = i;
            break;
        }
    }
    // Клик на пустое место
    if (i == node.length){
        if (nodeForLink){
            nodeForLink.link = false;
            nodeForLink = null;
        }
        else{
            node.push(new Node(x, y, 20, node.length + 1));
        }
        
    }

}

// Инициализация графа
let selectedNode = null;
let nodeForLink = null;
let node = [];

for (let i = 0; i < 5; i++){
    node.push(new Node(50 + (i*60), 50, 20, i+1));
}
node[0].edges.push(new Edge(node[2], 2));
//node[0].edges.push(new Edge(node[3], 3));
//node[0].edges.push(new Edge(node[4], 4));
// Отрисовка редактора
setInterval(function(){
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // Отрисовка события соединеня выбранной вершины
    if (nodeForLink && nodeForLink.link){
        line(nodeForLink.x, nodeForLink.y, nodeForLink.posX, nodeForLink.posY);
    }
    //Отрисовка связей
    for (let i = 0; i < node.length; i++){
        node[i].drawLink();  
    }
    //Отрисовка вершин
    for (let i = 0; i < node.length; i++){
        node[i].draw();     
        if (node[i].selected){
            node[i].stroke();
        };
    }
})