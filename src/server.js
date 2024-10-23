const express=require('express');
const app = express();
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const path = require("path");
const handlebars = require("express-handlebars");
const methodOverride = require('method-override');
const routes = require('./routes');
// config express to use morgan
app.use(morgan('combined'));

// config express to use static files
app.use(express.static(path.join(__dirname, "resources")));
app.use(methodOverride('_method'));

// Template Engine
app.engine("hbs", handlebars.engine({ 
  extname: ".hbs",
  helpers:{
    sum: (a,b) => a+b,
} }));
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'resources/views')); 


// config express to serve static files
app.use(express.urlencoded({ extended: true }));
routes(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});