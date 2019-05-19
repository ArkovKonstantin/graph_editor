"use strict";
function save_graph() {

    let graph = JSON.stringify(node);
    let graph_title = prompt("Enter the title of the graph")

    $.ajax({
        type: "POST",
        url: "/get_len",
        data: {"graph": graph, "graph_title": graph_title},
        type: 'POST',
        success: function(response) {
            
            // let res = JSON.parse(response); 
            // res.pop();
            // res.pop();
            // console.log(res);
            // console.log(typeof(res))
            // node = []
            // // restore vertexs
            // for (let i = 0; i < res.length; i++){
            //     node.push(new Node(res[i].x, res[i].y, res[i].radius, res[i].name, res[i].idx));
            // }
            // // restore edges
            // for (let i = 0; i < node.length; i++){

            //     for (let j = 0; j < res[i].edges.length; j++){
            //         let curr_neighbour = res[i].edges[j].neighbour;
            //         for (let k = 0; k < node.length; k++){
            //             if (curr_neighbour.idx == node[k].idx){

            //                 node[i].edges.push(new Edge(node[k], res[i].edges[j].distance))
            //             }
            //         }
            //     }
            // }   
        },
        error: function(error) {
            console.log(error);
        }
    });
}

document.getElementById("save").onclick = save_graph;
