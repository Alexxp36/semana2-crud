const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, "public")));

// Conexión a PostgreSQL (RENDER)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Obtener usuarios
app.get("/usuarios", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener usuarios");
    }
});

// Crear usuario
app.post("/usuarios", async (req, res) => {
    try {
        const { nombre, email } = req.body;

        await pool.query(
            "INSERT INTO usuarios (nombre, email) VALUES ($1, $2)",
            [nombre, email]
        );

        res.json({ mensaje: "Usuario creado" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear usuario");
    }
});

// Actualizar usuario
app.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;

        await pool.query(
            "UPDATE usuarios SET nombre=$1, email=$2 WHERE id=$3",
            [nombre, email, id]
        );

        res.json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar");
    }
});

// Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM usuarios WHERE id=$1", [id]);

        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar");
    }
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
