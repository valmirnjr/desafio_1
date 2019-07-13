const express = require("express");

const server = express();

server.use(express.json());

// Projetos de exemplo, inicializados para facilitar testes e debug
const projects = [
  { id: 1, title: "goStack", tasks: [] },
  { id: 2, title: "Artigo", tasks: [] },
  { id: 3, title: "Startup", tasks: [] }
];

// Função que retorna o número de requisições realizadas
const addOne = (function() {
  let requisitionsNumber = 0;
  return function() {
    return ++requisitionsNumber;
  };
})();

// Middelware global de contagem do número de rrequisições já realizadas
server.use((req, res, next) => {
  console.log(addOne());

  return next();
});

/* Middleware que checa se a id passada como parâmetro realmente existe, antes
de realizar alguma ação com a id */
function checkIdExists(req, res, next) {
  const userIds = projects.map(element => element.id);
  if (!userIds.some(userId => userId == req.params.id)) {
    return res.status(400).json("User id does not exist.");
  }
  return next();
}

// Rota de listagem de todos os projetos e atividades
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Rota de listagem de 1 único projeto
server.get("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  projects.map(element => {
    if (element.id == id) {
      return res.json(element);
    }
  });
});

// Criação de um novo projeto
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const newProject = { id, title, tasks: [] };

  projects.push(newProject);

  return res.json(newProject);
});

// Edição do título de um projeto via id
server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(element => {
    if (element.id == id) {
      element.title = title;

      return res.json(element);
    }
  });

  return res.json({ error: "Id not found." });
});

// Deletar projeto via id
server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  projects.map((element, index, arr) => {
    if (element.id == id) {
      arr.splice(index, 1);

      return res.send();
    }
  });

  return res.json({ error: "Id not found." });
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(element => {
    if (element.id == id) {
      element.tasks.push(title);

      return res.json(element);
    }
  });
});

server.listen(3000);
