"use strict";
//console.log(document);
//alert(document)
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");

cnv.height = 500;
cnv.width = 500;
//cnv.style.backgroundColor = "#b4b4b4";
cnv.style.backgroundImage = "url(setka.png)";
cnv.style.border = "1px solid black";
//cnv.style.margin = "30px";


ctx.strokeStyle = "red";
ctx.lineWidth = 4;
ctx.font = "16px Comic Sans MS";
ctx.textBaseline="middle";
ctx.textAlign = "center";


const fillArc = function (x, y, r) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.fill();
    ctx.closePath();
}

const strokeArc = function (x, y, r) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false)
    ctx.stroke();
    ctx.closePath();
}

const line = function (x0, y0, x, y) {
    ctx.strokeStyle = "black";
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

const Node = function (x, y, radius, num){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.num = num;
    this.selected = false;
    this.arrOfLinkedNode = [];
    this.posX = null;
    this.posY = null;
    this.link = false;
}


Node.prototype = {
    draw : function(){
        fillArc(this.x, this.y, this.radius);
        ctx.fillStyle = "white";
        ctx.fillText(this.num, this.x, this.y);
    },
    stroke : function(){
        strokeArc(this.x, this.y, this.radius);
    },
    drawLink: function(){
        for (let j = 0; j < this.arrOfLinkedNode.length; j++) {
            line(this.x, this.y, this.arrOfLinkedNode[j].x, this.arrOfLinkedNode[j].y);
        }
    },   
}

window.onmousemove = function(e){
    if (selectedNode){
        selectedNode.x = e.pageX;
        selectedNode.y = e.pageY;
    }
    if (nodeForLink && nodeForLink.link){
        nodeForLink.posX = e.pageX;
        nodeForLink.posY = e.pageY;
    }
}
window.onmousedown = function(e){
    let x = e.pageX, y = e.pageY;
    for (let i = 0; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){
            node[i].selected = true;
            selectedNode = node[i];
            //Соединение с выбранной вершиной
            if (nodeForLink && nodeForLink.link && (node[i].num != nodeForLink.num)){
                nodeForLink.arrOfLinkedNode.push(node[i])
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
        if (nodeForLink.posX == e.pageX && nodeForLink.posY == e.pageY){
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
    let x = e.pageX, y = e.pageY;
    for (; i < node.length; i++){
        if (isCursorInNode(x, y, node[i])){    
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
node[0].arrOfLinkedNode.push(node[2])
node[0].arrOfLinkedNode.push(node[3])
node[0].arrOfLinkedNode.push(node[4])
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