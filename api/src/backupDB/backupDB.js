// const { exec } = require("child_process");
// const cron = require("node-cron");
// const moment = require("moment");
// const path = require("path");
// const url = require("url");

// // Función para obtener información de la URL de la base de datos
// const getDatabaseConfig = () => {
//   const dbUrl = process.env.DATABASE_URL;
//   const parsedUrl = url.parse(dbUrl);

//   const PGHOST = parsedUrl.hostname;
//   const PGPORT = parsedUrl.port;
//   const [PGUSER, PGPASSWORD] = parsedUrl.auth.split(":");
//   const PGDATABASE = parsedUrl.pathname.split("/")[1];

//   return { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE };
// };

// // Función para realizar el respaldo de la base de datos
// const backupDatabase = () => {
//   const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } =
//     getDatabaseConfig();
//   const date = moment().format("YYYY-MM-DD_HH-mm-ss"); // Formato para la fecha

//   // Cambia la ruta a un directorio válido en tu sistema
//   const backupFile = path.join(__dirname, `backup_${date}.sql`); // Guarda el respaldo en el mismo directorio del script

//   // Comando para realizar el backup en Windows
//   const command = `set PGPASSWORD=${PGPASSWORD} && "C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump" --host=${PGHOST} --port=${PGPORT} --username=${PGUSER} --no-password --verbose --file="${backupFile}" --format=custom ${PGDATABASE}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error en el respaldo: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Error en el respaldo: ${stderr}`);
//       return;
//     }
//     console.log(`Respaldo realizado correctamente: ${stdout}`);
//   });
// };

// // Programa el cron job para que se ejecute todos los días a las 12:00
// cron.schedule("0 12 * * *", () => {
//   console.log("Iniciando respaldo de la base de datos...");
//   backupDatabase();
// });

// // Exportar la función de respaldo para uso externo
// module.exports = backupDatabase;
