// utils/limpiarBackups.js
const fs = require('fs');
const path = require('path');

const limpiarBackupsViejos = () => {
  const dir = path.join(__dirname, '../backups');
  const archivos = fs.readdirSync(dir);

  const ahora = Date.now();
  archivos.forEach(archivo => {
    const filePath = path.join(dir, archivo);
    const stats = fs.statSync(filePath);

    // Si tiene más de 1 día, eliminar 
    const unDia = 1000 * 60 * 60 * 24;
    if (ahora - stats.mtimeMs > unDia) {
      fs.unlinkSync(filePath);
    }
  });
};

module.exports = { limpiarBackupsViejos };
