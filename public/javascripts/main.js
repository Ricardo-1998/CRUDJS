window.onload = () => {
    app.init();
}

let app = {
    init: function () {
        this.addEvents();
        this.loadContent();
    },
    addEvents: function () {
        document.postForm.addEventListener("submit", (event) => {
            this.submitPost(event, this.addRow);
        });
    },
    addRow: function (data) {
        let tbody = document.getElementsByClassName("posts")[0];
        let tr = document.createElement("tr");
        let deletePost = this.deletePost;
        let update = this.updatePost;

        tr.innerHTML = `<td>${data._id} </td>
                        <td>${data.nombre}</td>
                        <td>${data.autor}</td>
                        <td>
                            <a href="#" class="delete"> Delete </a> 
                            <a href="#" class="update"> Update </a>
                        </td>`;

        tr.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
            deletePost(event, data, tr, tbody);
        });
        tr.getElementsByClassName("update")[0].addEventListener("click", (event) => {
            updatePost(tr, tbody, data);
        });
        tbody.appendChild(tr);
    },
    updatePost: function(tr, tbody, data) {
        tr.innerHTML = `
                                <td colspan="3"> 
                                    <form action="/api/post">
                                        <input type="text" name="id" readonly value="${data._id}">
                                        <input type="text" name="nombre" value="${data.nombre}">
                                        <input type="text" name="autor" value="${data.autor}">
                                        <input type="submit" value="Save">
                                        <input type="button" value="Cancel">
                                    </form>
                                </td>`;
        let form = tr.getElementsByTagName("form")[0];
  

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            let dataForm = {
                nombre: form.nombre.value,
                autor: form.autor.value
            };
            fetch('/api/post/' + data._id, {
                    method: 'PUT',
                    body: JSON.stringify(dataForm),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then(resData => {
                    if (resData.ok) {
                        let trN = document.createElement("tr");
                        trN.innerHTML = `<td>${resData.old._id} </td>
                                            <td>${dataForm.nombre}</td>
                                            <td>${dataForm.autor}</td>
                                            <td>
                                                <a href="#" class="delete"> Delete </a> 
                                                <a href="#" class="update"> Update </a>
                                            </td>`;

                        tbody.replaceChild(trN, tr);
                        trN.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
                            this.deletePost(event, data, trN, tbody);
                        });
                        trN.getElementsByClassName("update")[0].addEventListener("click", (event) => {
                            this.updatePost(trN, tbody, data);
                        });
                    } else {
                        document.getElementsByClassName("errors")[0].innerText = "No se puede actulizar";
                    }
                });
        });
    },
    deletePost: (event, data, tr, tbody) => {
        event.preventDefault();
        fetch('/api/post/' + data._id, {
                method: 'DELETE'
            }).then(res => res.json())
            .then(res => {
                if (res.ok) {
                    tbody.removeChild(tr);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo elminiar";
                }
            })
    },
    submitPost: (event, addRow) => {
        event.preventDefault();
        let data = {
            nombre: document.postForm.nombre.value,
            autor: document.postForm.autor.value
        };
        fetch('/api/post', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .then(_data => {
                if (_data.ok) {
                    addRow(_data.guardado);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });
    },
    loadContent: function () {
        fetch('/api/post', {
                method: 'GET'
            }).then(res => {
                return res.json()
            })
            .then(data => {

                if (data.ok) {
                    data.posts.forEach(element => {
                        this.addRow(element);
                    });
                }
            })
    }
}