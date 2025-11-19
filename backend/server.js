import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import MD5 from "crypto-js/md5.js";
import morgan from 'morgan';
import bcrypt from 'bcrypt';


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
      message: 'Fields cannot be empty'
    });
  }

  try {
    // Открываем соединение (или берем из пула, если вы настроите его глобально)
    const db = await openDb();

    // check user already exists
    const existingUser = await db.get(
      'SELECT * FROM users WHERE login = ? or email = ?',
      [login, email]
    );

    if (existingUser) {
      let errorMessage = 'User already exists';

      if (existingUser.login === login) {
        errorMessage = 'Login already taken';
      } else if (existingUser.email === email) {
        errorMessage = 'Email already registered';
      }

      return res.status(200).json({
        success: false,
        message: errorMessage
      });
    }



    // insert non-confirmed user
    const decoded_password = await decode_password(password);
    const result = await db.run(
      'INSERT INTO users (login, password, email, phone, registration_dt, confirmed) VALUES (?, ?, ?, ?, ?, ?)',
      [login, decoded_password, email, phone, now(), 0]
    );
    const userId = result.lastID;



    // insert registration link
    const registration_link = MD5(`${login}${email}`).toString();

    await db.run(
      'INSERT INTO registration (user_id, link) VALUES (?, ?)',
      [userId, registration_link]
    );


    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
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
      message: 'Empty link'
    });
  }
  try {
    const db = await openDb();
    // search for link
    const result = await db.get(
      'SELECT user_id FROM registration WHERE link = ?',
      [trimmedLink]
    );

    // link not found
    if (!result) {
      return res.status(200).json({
        success: false,
        message: 'specified link not found'
      });
    }

    // update user information and delete link
    await db.run('DELETE FROM registration WHERE user_id =?', [result.user_id]);
    await db.run('UPDATE users SET confirmed = 1, last_visit_dt = ? WHERE id = ?', [now(), result.user_id]);


    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Confirmation error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }

});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  // check user exists
  // create token for user
  // return token


  // fields validation
  if (!login || !password) {
    return res.status(200).json({
      success: false,
      message: 'Fields cannot be empty'
    });
  }

  try {
    const db = await openDb();

    // check user  exists
    const user_data = await db.get('SELECT * FROM users WHERE login = ?', [login]);

    if (!user_data) {
      return res.status(200).json({
        success: false,
        message: 'login not found'
      });
    }




  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.use(notFound);
app.use(errorHandler);
