const {app} = require("./app")
console.log(app, "app in listen")
const { PORT = 5432 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));