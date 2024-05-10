import express, { Request, Response, NextFunction } from "express";
import path from "path";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const mysql = require('mysql2/promise');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); 

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0000',
    database: 'testDB'
});

// public 폴더를 정적 파일 제공을 위한 디렉토리로 지정
// app.use(express.static(path.join(__dirname, '..', 'public')));

// app.get('/', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// app.get('/home', (req: Request, res: Response) => {
//     const userID = req.cookies.userID;
//     res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
// });

// app.get('/addUser', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'adduser.html'));
// });

// app.get('/index', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// app.get('/setUp', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'setup.html'));
// });

// app.get('/setUp2', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'setup2.html'));
// });

// app.get('/setUp_pw', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '..', 'public', 'setup_pw.html'));
// });

app.post('/login', async (req: Request, res: Response) => {
    const id = req.body.id;
    const pw = req.body.pw;

    if (!id || !pw) {
        res.status(400).json({ error: 'ID와 PW를 모두 입력하세요.' });
        return;
    }

    res.locals.id = id;

    try {
        const conn = await pool.getConnection();
        const query = 'SELECT * FROM users WHERE user_id = ? AND user_pw = ?';
        const [rows]: [any[]] = await conn.query(query, [id, pw]);
        const userNumQuery = 'SELECT user_num FROM users WHERE user_id = ?';
        const [userNumRows]: [any[]] = await conn.query(userNumQuery, [id]);
        const userNum = userNumRows[0].user_num;
        console.log('userNumRows:', userNumRows);
        console.log('userNum:', userNum);
        conn.release();

        if (rows.length > 0) {          
            res.cookie('userNum', userNum);
            res.cookie('userID', id); 
            res.redirect('/home');
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/signup', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

app.post('/signup', async (req: Request, res: Response) => {
    const id = req.body.id;
    const pw = req.body.pw;

    if (!id || !pw) {
        res.status(400).json({ error: 'ID와 PW를 모두 입력하세요.' });
        return;
    }

    try {
        const conn = await pool.getConnection();
        const query = 'INSERT INTO users (user_id, user_pw) VALUES (?, ?)';
        const [result] = await conn.query(query, [id, pw]);
        conn.release();

        if (result.affectedRows > 0) {
            res.redirect('/index');
        } else {
            res.status(500).json({ error: 'Failed to insert user information' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/changePW', async (req: Request, res: Response) => {
    const id = req.body.id;
    const newpw = req.body.pw;

    if (!newpw) {
        console.error('새로운 PW를 입력하세요.');
        res.status(400).json({ error: '새로운 PW를 입력하세요.' });
        return;
    }

    try {
        const conn = await pool.getConnection();
        const query = 'UPDATE users SET user_pw = ? WHERE user_id = ?';
        const [result] = await conn.query(query, [newpw, id]);
        conn.release();

        if (result.affectedRows > 0) {            
            console.log('비밀번호 변경이 완료되었습니다!');
            res.status(200).json({ message: '비밀번호 변경이 완료되었습니다!' });
        } else {
            console.error('Failed to insert new password');
            res.status(500).json({ error: 'Failed to insert new password' });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server started');
});
