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
        if (obj[key] < min){
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
    //console.log(unvisited);
    

    //console.log(nodes[current].edges);

    while (!isEmpty(unvisited)){
        current = min(unvisited);
        //console.log("node[current]");
        console.log(unvisited);
        node[current].edges.forEach(function(edge){
            //console.log("edge");
            //console.log(edge);
            //edge = {neighbour: obj, distance: number}
            let idx = edge.neighbour.num - 1;
            // if (!(idx in unvisited)){
            //     continue;
            // }
            if (unvisited[idx] > unvisited[current] + edge.distance){
                unvisited[idx] = unvisited[current] + edge.distance;
                prev[idx] = current;
            }
        });
        visited[current] = unvisited[current];
        delete unvisited[current];

    }
    return {visited, prev}
}


//     while (!isEmpty(unvisited)){
//         current = min(unvisited)
//         for (let neighbour in nodes[current].arrOfLinkedNode){
//             console.log(neighbour);
//             // if (!(neighbour in unvisited)){
//             //     continue
//             // }
//             // else if (unvisited[neighbour] > unvisited[current] + distances[current][neighbour]){
//             //     unvisited[neighbour] = unvisited[current] + distances[current][neighbour];
//             //     prev[neighbour] = current
//             // }
//         }
//         visited[current] = unvisited[current];
//         delete unvisited[current];

//     }
//     return visited, prev;
// }

//let res = dijkstra(distances, 'B');
//console.log(res);
