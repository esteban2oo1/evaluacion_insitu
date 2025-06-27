const mysqldump = require('mysqldump');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const generarBackup = async () => {
  const backupPath = path.join(__dirname, '../../backups');
  if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);

  const fileName = `backup-${Date.now()}.sql`;
  const filePath = path.join(backupPath, fileName);

  await mysqldump({
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    dumpToFile: filePath,
  });

  return fileName;
};

module.exports = { generarBackup };
