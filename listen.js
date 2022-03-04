const app = require("./app")
console.log(app, "app in listen")
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));