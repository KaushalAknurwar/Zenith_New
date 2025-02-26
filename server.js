import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist')));

// API Routes
app.use('/api', (req, res, next) => {
	const apiPath = join(__dirname, 'src', 'pages', 'api');
	import(join(apiPath, `${req.path}.ts`))
		.then(module => {
			module.default(req, res);
		})
		.catch(error => {
			console.error('API route error:', error);
			res.status(500).json({ error: 'Internal server error' });
		});
});

// Serve frontend
app.get('*', (req, res) => {
	res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
