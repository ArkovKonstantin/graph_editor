import {dijkstra} from "./gijkstra.js";

let btnRun = document.getElementById("btn_run");
let btnStop = document.getElementById("btn_stop");

const clearPaths = function(){
    node.forEach(function(node){
        node.edges.forEach(function(edge){
            edge.color = "black";
        });
    });
}

btnStop.onclick = clearPaths;

btnRun.onclick = function(){
    console.log(node);
    clearPaths();
    let start_node = 0;
    let end_node = 3;
    let res = dijkstra(node, start_node);
    console.log(res);
    //Отображение кратчайшего пути
    while(end_node != start_node){

        node[res.prev[end_node]].edges.forEach(function(edge){
            let idx = edge.neighbour.num - 1;
            if (idx == end_node){
                edge.color = "red";
            }
        });
        end_node = res.prev[end_node];
    }
}