const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Datos de ejemplo (podría ser una DB real después)
const recomendaciones = {
  perros: ["Arnés reflectante", "Snacks dentales", "Cepillo deshedding"],
  gatos: ["Rascador de cartón", "Pelotas con hierba gatera", "Fuente de agua"]
};

app.get('/api/recomendaciones/:tipoMascota', (req, res) => {
  res.json(recomendaciones[req.params.tipoMascota] || []);
});

app.listen(3002, () => console.log('API Recomendaciones en puerto 3002'));