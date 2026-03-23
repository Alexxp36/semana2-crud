const API = "http://localhost:3000/usuarios";

const form = document.getElementById("form");
const lista = document.getElementById("lista");

// Cargar usuarios
async function cargarUsuarios() {
    const res = await fetch(API);
    const data = await res.json();

    lista.innerHTML = "";

    data.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${user.nombre} - ${user.email}
            <button class="btn" onclick="eliminar(${user.id})">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}

// Crear usuario
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, email })
    });

    form.reset();
    cargarUsuarios();
});

// Eliminar usuario
async function eliminar(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    cargarUsuarios();
}

// Inicializar
cargarUsuarios();