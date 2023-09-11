const axios = require('axios');
const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors'); // Importa la biblioteca cors
const port = 3001;

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos no está en localhost
    user: 'root',
    password: 'java0900',
    database: 'breaking_quotes', // Reemplaza con el nombre de tu base de datos
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos establecida.');
    }
});


// Configura CORS para permitir solicitudes desde localhost:3000 (tu aplicación React)
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());


app.get('/get-data-from-external-api', async (req, res) => {
    try {
        const externalApiUrl = 'https://api.breakingbadquotes.xyz/v1/quotes'; // Reemplaza con la URL de la API externa que deseas consumir
        const response = await axios.get(externalApiUrl);
        const responseData = response.data;

        // Puedes manipular y enviar los datos de la API externa como desees
        res.json(responseData[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener datos de la API externa.' });
    }
});


// Ruta para agregar una cita a la base de datos
app.post('/add', (req, res) => {
    const { author, quote } = req.body;

    // Ejecuta una consulta SQL para insertar la cita en la base de datos
    const sql = 'INSERT INTO quotes (author, quote) VALUES (?, ?)';
    db.query(sql, [author, quote], (err, result) => {
        if (err) {
            console.error('Error al agregar la cita:', err);
            res.status(500).json({ error: 'Error al agregar la cita' });
        } else {
            console.log('Cita agregada con éxito');
            res.status(200).json({ message: 'Cita agregada con éxito' });
        }
    });
});

// Agrega más rutas y controladores según sea necesario
module.exports = router;

app.listen(port, () => {
    console.log(`Servidor Express corriendo en http://localhost:${port}`);
});



