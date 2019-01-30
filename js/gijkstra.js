"use strict";

let distances = {
    'B': {'A': 5, 'D': 1, 'G': 2},
    'A': {'B': 5, 'D': 3, 'E': 12, 'F' :5},
    'D': {'B': 1, 'G': 1, 'E': 1, 'A': 3},
    'G': {'B': 2, 'D': 1, 'C': 2},
    'C': {'G': 2, 'E': 1, 'F': 16},
    'E': {'A': 12, 'D': 1, 'C': 1, 'F': 2},
    'F': {'A': 5, 'E': 2, 'C': 16}
}

// console.log(distances.length)

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
        if (obj[key] < min){
            min = obj[key];
            minKey = key;
        }
    }
    return minKey
}
function dijkstra(distances, s){
    let unvisited = {};
    let visited = {};
    let prev = {}; 
    let current = null;
    Object.keys(distances).forEach(function(el){
        unvisited[el] = Infinity;
    })
    unvisited[s] = 0;

    while (!isEmpty(unvisited)){
        current = min(unvisited)
        for (let neighbour in distances[current]){
            if (!(neighbour in unvisited)){
                continue
            }
            else if (unvisited[neighbour] > unvisited[current] + distances[current][neighbour]){
                unvisited[neighbour] = unvisited[current] + distances[current][neighbour];
                prev[neighbour] = current
            }
        }
        visited[current] = unvisited[current];
        delete unvisited[current];

    }
    return visited, prev;
}

let res = dijkstra(distances, 'B');
console.log(res);
