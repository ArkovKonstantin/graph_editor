import {dijkstra} from "./gijkstra.js";
//Global parametrs
let btnRun = document.getElementById("btn_run");
let btnStop = document.getElementById("btn_stop");
let tab = document.getElementsByClassName("tab");
let tabContent = document.getElementsByClassName("tabContent");
let testBtn = document.getElementById("testBtn");
testBtn.count = 0;

const clearPaths = function(){
    node.forEach(function(node){
        node.color = "#f0f0f0";
        node.edges.forEach(function(edge){
            edge.color = "black";
        });
    });
}
btnStop.onclick = clearPaths;
function fun(c, d){
    console.log(c + " " + d);
    if (c  == d){
        return 
    }
    setTimeout(fun, 2000, ++c, d);
}
function draw_relax(progress, par){
    ctx.lineWidth = 5;
    let x1 = par.node.x, y1 = par.node.y,
    x2 = par.edge.neighbour.x, y2 = par.edge.neighbour.y;
    //console.log('y '+ y2);
    let k = (y2-y1)/(x2-x1);
    let b = (x2*y1-x1*y2)/(x2-x1);
    let x = progress*Math.abs(x2-x1) + Math.min(x1, x2), y = k*x + b; 
    line(x1, y1, x, y, "#ff8a3d");
    
    ctx.lineWidth = 2;
}
function animate(options){
    let start = performance.now();
    requestAnimationFrame(function animate(time){
        let timeFraction = (time - start)/options.duration;
        if (timeFraction > 1) timeFraction = 1;
        let progress = options.timing(timeFraction);
        options.draw(progress, options.par);

        if (timeFraction < 1){
            requestAnimationFrame(animate);
        }
        else{
            //Конец анимации
            options.par.edge.color = "#ff8a3d";
        }
    }); 

}
testBtn.onclick = function(){
    let par = {edge: node[0].edges[0], node: node[0]} // параметры для этой функции
    animate({
        duration: 1300,
        timing: function(timeFraction){ // скорость анимации
            return timeFraction;
        },
        draw: draw_relax, // функция, определенный шаг алгоритма
        par: par
    });    
}

btnRun.onclick = function(){
    //console.log(node);
    clearPaths();
    let log = []
    let start_node = 0;
    let end_node = 3;
    let res = dijkstra(node, start_node);
    //console.log(res);
    //window.res = res;
    //Отображение кратчайшего пути
    while(end_node != start_node){

        node[res.prev[end_node]].edges.forEach(function(edge){ // {2: 1, 3: 2}
            let idx = edge.neighbour.num - 1;
            if (idx == end_node){
                edge.color = "#e8534f";
                log.push(edge.neighbour);
            }
        });
        end_node = res.prev[end_node];
    }
    
    log.push(node[start_node]);
    window.log = log;
    window.count = log.length - 1;
    
}

window.onload = function(){
    for (let i = 1; i < tabContent.length; i++){
        tabContent[i].classList.add("hide");
    }
}

document.getElementById("tabs").onclick = function(e){
    let target = e.target;
    //console.log(e);
    if (target.className == "tab"){
        for (let i = 0; i<tab.length; i++){
            if (tab[i] == target){
                tab[i].classList.add("whiteborder");
                tabContent[i].classList.remove("hide");
            }
            else{
                tab[i].classList.remove("whiteborder");
                tabContent[i].classList.add("hide");
            }
        }
    }
    
}