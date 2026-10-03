const app = require('./app');
const { puerto, nombreServicio, version } = require('./config');

app.listen(puerto, () => {
  console.log(`${nombreServicio} v${version} escuchando en http://localhost:${puerto}`);
});
