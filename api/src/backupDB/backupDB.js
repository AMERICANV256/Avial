// src/backupDB/backupDB.js
const { exec } = require("child_process");
const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

// Configuración de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configura la URL de tu base de datos y el bucket de S3
const DATABASE_URL = process.env.DATABASE_URL;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Función para realizar el backup
const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dumpFilePath = path.join(__dirname, `backup-${timestamp}.sql`);

  // Comando para hacer el backup de PostgreSQL
  const command = `pg_dump ${DATABASE_URL} -f ${dumpFilePath}`;

  exec(command, (error) => {
    if (error) {
      console.error("Error al hacer el backup:", error);
      return;
    }

    // Leer el archivo SQL y subirlo a S3
    fs.readFile(dumpFilePath, (err, data) => {
      if (err) {
        console.error("Error al leer el archivo de backup:", err);
        return;
      }

      const params = {
        Bucket: BUCKET_NAME,
        Key: `backups/backup-${timestamp}.sql`,
        Body: data,
      };

      s3.upload(params, (s3Err, data) => {
        if (s3Err) {
          console.error("Error al subir el archivo a S3:", s3Err);
        } else {
          console.log(`Backup exitoso y almacenado en S3: ${data.Location}`);
        }
        fs.unlinkSync(dumpFilePath);
      });
    });
  });
};

module.exports = backupDatabase;
