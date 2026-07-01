import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db.js";

const router = express.Router();

//rotas de registro e login
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
    }

    const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );

    if(rows.length > 0) {
        return res.status(400).json({ message: "Email já cadastrado" });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await db.execute(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [name, email, passwordHash]
    );

    res.json({ message: "Usuário registrado com sucesso" });
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.execute(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );

    const usuario = rows[0];

    if (!usuario) {
        return res.status(401).json({
            message: 'Email ou senha inválidos'
        });
    }

    const passwordCorreta = await bcrypt.compare(
        password,
        usuario.senha
    );

    if (!passwordCorreta) {
        return res.status(401).json({
            message: 'Email ou senha inválidos'
        });
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );

    return res.status(200).json({
        message: 'Login realizado',
        token: token
    });
})

//rotas para alterar e buscar tarefas
router.post("/tasks", autenticarToken, async (req, res) => {
    const { priorities, date } = req.body;
    const userId = req.usuario.id; 

    let query = "SELECT * FROM tarefas WHERE usuario_id = ?";
    let params = [userId];

    if (priorities) {
        if (priorities.length === 0) {
            query += " AND 1=0"; 
        } else if (priorities.length < 3) {
            query += " AND prioridade IN (?)";
            params.push(priorities); 
        }
    }

    if (date && date.trim() !== "") {
        query += " AND data_tarefa = ?";
        params.push(date);
    }

    try {
        const [tasks] = await db.query(query, params);
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Erro no SQL:", err); 
        res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
});

router.post("/tasks/add", autenticarToken, async (req, res) => {
    const { taskId, task, priority, day, finished } = req.body;
    const userId = req.usuario.id;
    await db.execute(
        'INSERT INTO tarefas (taskId, usuario_id, nome, prioridade, data_tarefa, finalizado) VALUES (?, ?, ?, ?, ?, ?)',
        [taskId, userId, task, priority, day, finished]
    );
    res.json({ message: "Tarefa adicionada com sucesso" });
})

router.delete("/tasks/delete/:id", autenticarToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.usuario.id;

    await db.execute(
        'DELETE FROM tarefas WHERE taskId = ? AND usuario_id = ?',
        [id, userId]
    );
    res.json({ message: "Tarefa deletada com sucesso" });
})

router.put("/tasks/update/:id", autenticarToken, async (req, res) => {
    const { id } = req.params;
    const {task, priority, day} = req.body;
    const userId = req.usuario.id;
    await db.execute(
        'UPDATE tarefas SET nome = ?, prioridade = ?, data_tarefa = ? WHERE taskId = ? AND usuario_id = ?',
        [task, priority, day, id, userId]
    );
    res.json({ message: "Tarefa atualizada com sucesso" });
})

router.patch("/tasks/finish/:id", autenticarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario.id;

        const [rows] = await db.execute(
            'SELECT finalizado FROM tarefas WHERE taskId = ? AND usuario_id = ?',
            [id, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        const novoStatus = rows[0].finalizado ? 0 : 1;

        await db.execute(
            'UPDATE tarefas SET finalizado = ? WHERE taskId = ? AND usuario_id = ?',
            [novoStatus, id, userId]
        );

        return res.status(200).json({ 
            mensagem: "Status da tarefa atualizado com sucesso!", 
            finalizado: novoStatus 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

//middleware para autenticar o token JWT
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.usuario = usuario;
        next();
    });
}

export default router;