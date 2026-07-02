import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

async function inicializarTabelas() {
    try {
        const connection = await db.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS tarefas (
                taskId VARCHAR(100) PRIMARY KEY,
                usuario_id INT NOT NULL,
                nome VARCHAR(255) NOT NULL,
                prioridade VARCHAR(20) NULL,
                data_tarefa DATE NULL,
                finalizado TINYINT(1) DEFAULT 0,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            );
        `);

        console.log("Tabelas sincronizadas com sucesso.");
        connection.release(); 
    } catch (error) {
        console.error("Erro ao inicializar tabelas: ", error);
    }
}

inicializarTabelas();

export default db;