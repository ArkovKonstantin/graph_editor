"use strict";
function isEmpty(obj) {
    for (let key in obj){
        return false;
    }
    return true;
}
function min(obj){
    let min = Infinity;
    let minKey = "";
    for (let key in obj){
        if (obj[key] <= min){
            min = obj[key];
            minKey = key;
        }
    }
    return minKey
}
export function dijkstra(node, s){
    let unvisited = {};
    let visited = {};
    let prev = {}; 
    let current = null;
    node.forEach(function(el, idx){
        unvisited[idx] = Infinity;
    })
    unvisited[s] = 0;
    
    while (!isEmpty(unvisited)){
        current = min(unvisited);
        if (node[current].edges.length > 0){
            node[current].edges.forEach(function(edge){
                let idx = edge.neighbour.num - 1;
                if (unvisited[idx] > unvisited[current] + edge.distance){
                    unvisited[idx] = unvisited[current] + edge.distance;
                    prev[idx] = current;
                    
                }
            });            
        }
        
        visited[current] = unvisited[current];
        delete unvisited[current];

    }
    return {visited, prev}
}

