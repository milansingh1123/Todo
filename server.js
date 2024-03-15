const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/todos', (req, res) => {
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading todos');
            return;
        }
        const todos = data.split('\n').filter(todo => todo.trim() !== '');
        res.json(todos);
    });
});

app.post('/todos', (req, res) => {
    const newTodo = req.body.todo;
    if (!newTodo) {
        res.status(400).send('Todo is required');
        return;
    }
    fs.appendFile('todos.txt', `${newTodo}\n`, (err) => {
        if (err) {
            res.status(500).send('Error adding todo');
            return;
        }
        res.status(201).send('Todo added successfully');
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading todos');
            return;
        }
        const todos = data.split('\n').filter(todo => todo.trim() !== '');
        if (id < 0 || id >= todos.length) {
            res.status(404).send('Todo not found');
            return;
        }
        todos.splice(id, 1);
        fs.writeFile('todos.txt', todos.join('\n'), (err) => {
            if (err) {
                res.status(500).send('Error deleting todo');
                return;
            }
            res.send('Todo deleted successfully');
        });
    });
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTodo = req.body.todo;
    if (!updatedTodo) {
        res.status(400).send('Todo is required');
        return;
    }
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading todos');
            return;
        }
        let todos = data.split('\n').filter(todo => todo.trim() !== '');
        if (id < 0 || id >= todos.length) {
            res.status(404).send('Todo not found');
            return;
        }
        todos[id] = updatedTodo;
        fs.writeFile('todos.txt', todos.join('\n'), (err) => {
            if (err) {
                res.status(500).send('Error updating todo');
                return;
            }
            res.send('Todo updated successfully');
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});