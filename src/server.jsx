import path from 'path';
import express from 'express';
import morgan from 'morgan';
import { port, databaseUrl } from './config';
import render from './services/render';
import api from './api';
import db from './services/db';
import App from './components/App';
import routes from './components/routes';

const app = express();

const assets = path.resolve(__dirname, 'assets');

app.use(express.static(assets));
app.use(morgan('dev'));
app.use(express.json(), express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', assets);

app.use(db(databaseUrl));
app.use(api);

app.use(render(App, routes));

app.listen(port, (err) => {
    if (err) {
        console.log('err', err); // eslint-disable-line no-console
    } else {
        console.log(`running at port: ${port}`); // eslint-disable-line no-console
    }
});
