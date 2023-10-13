const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'tramitesdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.get('/db-ping', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        res.status(200).json({ message: 'Database connection successful!' });
        connection.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to connect to the database!' });
    }
});

app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;

    let connection;

    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT id, username, role FROM usuario WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            res.json({ id: user.id, username: user.username, role: user.role, token: '12345' });
            console.log(rows);
        } else {
            res.status(401).json({ message: 'Username or password is incorrect' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
});


app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    let connection;

    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT id, username, role FROM usuario WHERE id = ?', [userId]);

        if (rows.length > 0) {
            const user = rows[0];
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
