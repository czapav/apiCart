const express = require('express');
const port = 4000;
const app = express();
const dbMiddleware = require('./db.middleware');
const corsMiddleware = require('./cors.middleware');
const cartRouter = require('./routes/cart');
const productRouter = require('./routes/product');

//middleware for Angular project
app.use(corsMiddleware);

app.use(dbMiddleware);
app.use('/cart', cartRouter);
app.use('/product', productRouter);

app.listen(port, () => console.log(`App listening on port ${port}!`));
