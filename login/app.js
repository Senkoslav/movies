const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Далее вы можете использовать переменные `username` и `password` для проверки соответствия в базе данных.
  // Например, используя пакет mongoose для работы с базой данных MongoDB Atlas.

  // Отправьте ответ клиенту, например, если аутентификация успешна:
  res.send('Welcome back, ' + username + '!');
});

// Создание подключения к базе данных MongoDB Atlas
mongoose.connect('mongodb+srv://yaroslav76071:<qwertyH2SO4>@cluster0.3qyornp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Определение схемы пользователей
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Создание модели пользователей
const User = mongoose.model('User', UserSchema);

// Создание приложения Express
const app = express();

// Добавление парсера для чтения входных данных
app.use(bodyParser.urlencoded({ extended: true }));

// Добавление сессии
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false
}));

// Обработка POST-запроса на страницу входа
app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Запрос на получение данных пользователя из базы данных
  User.findOne({ email: email }, function(error, user) {
    if (error) {
      res.send({
        success: false,
        message: 'Ошибка при выполнении запроса к базе данных'
      });
    } else if (!user) {
      res.send({
        success: false,
        message: 'Пользователь с таким email не найден'
      });
    } else {
      // Проверка соответствия пароля, сохраненного в базе данных, с введенным паролем
      bcrypt.compare(password, user.password, function(error, result) {
        if (error) {
          res.send({
            success: false,
            message: 'Ошибка при проверке пароля'
          });
        } else if (!result) {
          res.send({
            success: false,
            message: 'Неверный пароль'
          });
        } else {
          // Создание сессии для пользователя
          req.session.userId = user._id;
          req.session.email = user.email;

          res.send({
            success: true,
            message: 'Аутентификация прошла успешно'
          });
        }
      });
    }
  });
});

// Запуск сервера на порту 3000
app.listen(3000, function() {
  console.log('Сервер запущен на порту 3000');
});


