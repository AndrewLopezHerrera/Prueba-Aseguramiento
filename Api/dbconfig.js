const sql = require('mssql');

/**
 * Esta función conecta el servidor con la base de datos.
 */
async function connectToDatabase() {
  const config = {
    user: 'usuarioPrueba',
    password: 'prueba1234567',
    server: 'localhost',
    database: 'WideWorldImporters',
    port: 1433,
    options: {
      encrypt: false,
      trustServerCertificate: false 
    }
  };
  try {
    await sql.connect(config);
    console.log("Conexión exitosa a SQL Server");
  } catch (err) {
    console.error("Error al conectar a SQL Server: ", err);
  }
}

module.exports = { sql, connectToDatabase };
