"use strict";
function save_graph() {

    let graph = JSON.stringify(node);
    let graph_title = prompt("Enter the title of the graph")

    $.ajax({
        type: "POST",
        url: "/save",
        data: { "graph": graph, "graph_title": graph_title },
        type: 'POST',
        success: function (response) {
   
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function upload(e) {
    let g_title = document.getElementById(e.target.id).bind_title;
    let g_body = window.g_lst[g_title]

    let res = JSON.parse(g_body);
    node = []
    // restore vertexs
    for (let i = 0; i < res.length; i++){
        node.push(new Node(res[i].x, res[i].y, res[i].radius, res[i].name, res[i].idx));
    }
    // restore edges
    for (let i = 0; i < node.length; i++){

        for (let j = 0; j < res[i].edges.length; j++){
            let curr_neighbour = res[i].edges[j].neighbour;
            for (let k = 0; k < node.length; k++){
                if (curr_neighbour.idx == node[k].idx){
    
                node[i].edges.push(new Edge(node[k], res[i].edges[j].distance))
                }
            }
        }
    }
    document.getElementById("redactor").style.display = "block";
    document.getElementById("graph_list").style.display = "none";

}

function del(e) {
    console.log(document.getElementById(e.target.id).bind_title)
}

function open_graph_list() {
    document.getElementById("redactor").style.display = "none";
    document.getElementById("graph_list").style.display = "block";

    $.ajax({
        type: "POST",
        url: "/get_graph_lst",
        data: {},
        type: 'POST',
        success: function (response) {
            let res = JSON.parse(response)
            window.g_lst = res // сохраняю глобально
            // console.log(res)
            let g_lst = document.getElementById("g_lst");
            g_lst.innerHTML = "";
            for (let key in res) {

                let newLi = document.createElement('li');
                let u_id = "u" + key, d_id = "d" + key;
                newLi.innerHTML = key + ' <a id = '+u_id+' href="#">Upload</a> <a id='+d_id+' href="#">Delete</a>';
                
                
                g_lst.appendChild(newLi);

                document.getElementById(u_id).onclick = upload;
                document.getElementById(u_id).bind_title = key;
                document.getElementById(d_id).onclick = del;
                document.getElementById(d_id).bind_title = key;

            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

document.getElementById("open").onclick = open_graph_list;
document.getElementById("save").onclick = save_graph;
