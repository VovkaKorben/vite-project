import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export async function openDb() {
    return open({
        filename: './test.db', // Путь к вашему файлу БД
        driver: sqlite3.Database
    });
}
