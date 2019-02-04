import {dijkstra} from "./gijkstra.js";

let btn = document.getElementById("btn_run");

btn.onclick = function(){
    console.log(node);
    let start_node = 0;
    let res = dijkstra(node, start_node);
    console.log(res);
}