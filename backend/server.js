import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
// import MD5 from "crypto-js/md5.js";
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


import { errorHandler, notFound } from './middleware/error.js';
// const openDb = require('./db'); // Импортируем нашу функцию
import { openDb } from './dbUtils.js';

dotenv.config();

const { API_PORT = 3500, SQLITE_DB } = process.env;

const db = new sqlite3.Database(`./${SQLITE_DB}`);
const now = () => { return new Date().toISOString(); }
const decode_password = async (password) => { return bcrypt.hash(password, 10); }

const app = express();
app.use(cors());

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev'));
const server = app.listen(API_PORT, () => {
  console.log(`🟩 API started on http://localhost:${API_PORT}`);
  console.log(`💗 Health check with http://localhost:${API_PORT}/api/health`);
});


// GET-STATUS route
app.get('/api/health', async (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// registration routines ---------------------------

// registration
app.post('/api/register', async (req, res) => {
  const { login, password, email, phone } = req.body;

  // 1. Валидация
  if (!login || !password || !email) {
    return res.status(400).json({
      success: false,
      error: 'Fields cannot be empty'
    });
  }

  try {
    // Открываем соединение (или берем из пула, если вы настроите его глобально)
    const db = await openDb();

    // check user/email already exists
    const existing_user = await db.get(
      'SELECT login,email FROM users WHERE login=? OR email=? UNION SELECT login,email FROM pending_users WHERE login=? OR email=?',
      [login, email, login, email]
    );

    if (existing_user) {
      let error_message = 'User already exists';

      if (existing_user.login === login) {
        error_message = 'Login already taken';
      } else if (existing_user.email.trim().toLowerCase() === email.trim().toLowerCase()) {
        error_message = 'Email already registered';
      }

      return res.status(200).json({
        success: false,
        error: error_message
      });
    }

    // insert non-confirmed user
    const registration_link = crypto.randomBytes(32).toString('base64url');;
    const decoded_password = await decode_password(password);
    const result = await db.run(
      'INSERT INTO pending_users (link,login, password, email, phone, added) VALUES (?, ?, ?, ?, ?, ?)',
      [registration_link, login, decoded_password, email, phone, now()]
    );


    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// confirmation by link
app.get('/api/confirm', async (req, res) => {
  const { link } = req.query;
  const trimmedLink = link ? link.trim() : link;
  console.log(trimmedLink);
  if (trimmedLink === '') {
    return res.status(200).json({
      success: false,
      error: 'Empty link'
    });
  }
  try {
    const db = await openDb();
    // search for link
    const pending_user = await db.get(
      'SELECT * FROM pending_users WHERE link = ?',
      [trimmedLink]
    );

    // link not found
    if (!pending_user) {
      return res.status(200).json({
        success: false,
        error: 'specified link not found'
      });
    }

    // move data from pending to permanent users table
    await db.run('INSERT INTO users (login, password, email, phone, registered, visited) VALUES (?, ?, ?, ?, ?, ?)',
      [pending_user.login, pending_user.password, pending_user.email, pending_user.phone, now(), now()]
    );
    await db.run('DELETE FROM pending_users WHERE user_id = ?', [pending_user.user_id]);


    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Confirmation error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
    });
  }

});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  // create token for user
  // return token


  // fields validation
  if (!login || !password) {
    return res.status(200).json({
      success: false,
      error: 'Fields cannot be empty'
    });
  }

  try {
    const db = await openDb();

    // check user  exists
    const user = await db.get('SELECT * FROM users WHERE login = ?', [login]);

    // check user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'login not found'
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        error: 'password doesnt match'
      });
    }
    const accessToken = crypto.randomBytes(32).toString('hex'); // 64 символа случайной строки

    // 4. Устанавливаем срок действия (например, 24 часа)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // Текущее время + 24 часа
    const tokenExpiry = expiryDate.toISOString();

    await db.run(
      'UPDATE users SET access_token = ?, token_expiry = ? WHERE user_id = ?',
      [accessToken, tokenExpiry, user.user_id]
    );


    const user_safe_data = {
      user_id: user.user_id,
      role: user.role,
      login: user.login,
      email: user.email,
      phone: user.phone,
      access_token: accessToken // updated token, not from DB
    };



    return res.status(200).json({
      success: true,
      user: user_safe_data
    });

  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// return user by token
app.get('/api/token/:token', async (req, res) => {
  const { token } = req.params;
  console.log(token);







  try {
    const db = await openDb();

    // check token  exists
    const token_record = await db.get('SELECT * FROM users WHERE access_token = ?', [token]);
    if (!token_record) {
      return res.status(401).json({
        success: false,
        error: 'token not found'
      });
    }

    const token_expiry = new Date(token_record.token_expiry);
    const now = new Date();

    // Проверка: Текущее время > Время истечения
    if (now > token_expiry) {

      return res.status(401).json({
        success: false,
        error: 'token expired'
      });
    }

    const user_safe_data = {
      user_id: token_record.user_id,
      role: token_record.role,
      login: token_record.login,
      email: token_record.email,
      phone: token_record.phone,
    };

    return res.status(200).json({
      success: true,
      data: user_safe_data
    });

  } catch (err) {
    console.error('Ошибка :', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }




  return res.status(200).json({
    success: true,
    token: token
  });
















});


// user information
app.post('/api/userinfo', async (req, res) => {
  const { request_user_id, token } = req.body;
  console.log(request_user_id, token);





  try {
    const db = await openDb();

    // check token  exists
    const logged = await db.get('SELECT * FROM users WHERE access_token = ?', [token]);
    if (!logged) {
      return res.status(401).json({
        success: false,
        error: 'token not found'
      });
    }
    const token_expiry = new Date(logged.token_expiry);
    const now = new Date();
    if (now > token_expiry) {

      return res.status(401).json({
        success: false,
        error: 'token expired'
      });
    }

    // token ok, set requested fields regarding user rights
    const fields = ['login', 'registered', 'visited', 'role'];
    if (request_user_id == logged.user_id || logged.role >= 1)
      fields.push('email', 'phone');

    const requested_user = await db.get(`SELECT ${fields.join(',')} FROM users WHERE user_id = ?`, [request_user_id]);
    if (!requested_user) {
      return res.status(404).json({
        success: false,
        error: 'user not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: requested_user
    });

  } catch (err) {
    console.error('Ошибка :', err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }


});



app.use(notFound);
app.use(errorHandler);
