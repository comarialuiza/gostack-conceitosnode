const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const results = repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repo);
  
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const repo = repositories.find(repo => repo.id === id);

  if (!repo) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { likes } = repo;

  const updatedRepo = { id, title, url, techs, likes }

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  const repo = repositories.find(repo => repo.id === id);

  if (!repo) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  let { title, url, techs, likes } = repo;

  likes = likes + 1;

  const updatedRepo = { id, title, url, techs, likes };

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);
});

module.exports = app;
