const path = require('path');
const { generarBackup } = require('../../services/descargas/backup.service');

const descargarBackup = async (req, res) => {
  try {
    const fileName = await generarBackup();
    const filePath = path.join(__dirname, '../../backups', fileName);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        res.status(500).send('Error al descargar el backup');
      }
    });
  } catch (error) {
    console.error('Error al generar el backup:', error);
    res.status(500).json({ message: 'Error interno del servidor al generar backup' });
  }
};

module.exports = { descargarBackup };