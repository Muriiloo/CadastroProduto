const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  secret: 'chave_secreta',
  resave: false,
  saveUninitialized: true,
}));

let usuarios = [{ username: 'murilo', password: '123' }];
let produtos = [];

app.get('/', (req, res) => {
  if (req.session.username) {
    res.redirect('/produtos');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(user => user.username === username && user.password === password);
  if (user) {
    req.session.username = username;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    res.redirect('/produtos');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/produtos', (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, 'public', 'produtos.html'));
  } else {
    res.send('Por favor, faça login primeiro.');
  }
});

app.post('/adicionar-produto', (req, res) => {
  if (req.session.username) {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidadeEstoque, fabricante } = req.body;
    produtos.push({ codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidadeEstoque, fabricante });
    res.redirect('/produtos');
  } else {
    res.send('Por favor, faça login primeiro.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/get-produtos', (req, res) => {
  res.json({ produtos, ultimoAcesso: req.cookies.ultimoAcesso });
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
