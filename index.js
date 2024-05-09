const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database"); // Importando a conexão do arquivo database.js

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/games', (req, res) => {
    connection.query("SELECT * FROM games", { type: connection.QueryTypes.SELECT})
    .then(games => {
        res.statusCode = 200;
        res.json(games);
    })
    .catch(error => {
        console.error(error);
        res.statusCode = 500;
        res.json({error: 'An error occurred while fetching data from the database.'});
    });
});

app.get('/games/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM games WHERE id = ${id}`)
    .then(game => {
        if (game[0].length > 0) {
            res.statusCode = 200;
            res.json(game[0][0]); // game[0][0] contém o resultado da consulta
        } else {
            res.statusCode = 404;
            res.json({error: 'Game not found.'});
        }
    })
    .catch(error => {
        console.error(error);
        res.statusCode = 500;
        res.json({error: 'An error occurred while fetching data from the database.'});
    });
});

app.post('/games', (req, res) => {
    const { id, title, price, year } = req.body;

    if (!id) {
        res.statusCode = 400;
        res.json({error: 'ID is required.'});
        return;
    }

    connection.query(`INSERT INTO games (id, title, price, year) VALUES (${id}, '${title}', ${price}, ${year})`)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        console.error('An error occurred:', error);
        res.statusCode = 500;
        res.json({error: 'An error occurred while inserting data into the database.'});
    });
});

app.delete('/games/:id', (req, res) => {
    const id = req.params.id;

    connection.query(`DELETE FROM games WHERE id = ${id}`)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        console.error(error);
        res.statusCode = 500;
        res.json({error: 'An error occurred while deleting data from the database.'});
    });
});

app.put('/games/:id', (req, res) => {
    const id = req.params.id;
    const { title, price, year } = req.body;

    connection.query(`UPDATE games SET title = '${title}', price = ${price}, year = ${year} WHERE id = ${id}`)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        console.error(error);
        res.statusCode = 500;
        res.json({error: 'An error occurred while updating data in the database.'});
    });
});

app.listen(4000, () => {
    console.log('Rodando!');
})