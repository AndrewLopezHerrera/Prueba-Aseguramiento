const express = require('express');
const app = express();
const port = 4000;
const { sql, connectToDatabase } = require('./dbconfig');
const Controlador = require('./Controlador');
const cors = require('cors');

/**
 * @brief Se conecta a la base de datos SQL Server utilizando la configuración definida en 'dbconfig'.
 */
connectToDatabase();

/**
 * @brief Instancia del controlador de la aplicación que contiene los métodos para interactuar con la base de datos.
 * @type {Controlador}
 */
const ControladorActual = new Controlador(sql);

// Middleware para permitir solicitudes desde dominios externos.
app.use(cors());

// Middleware para interpretar solicitudes con cuerpo en formato JSON.
app.use(express.json());

/**
 * @brief Ruta raíz que responde con un mensaje simple.
 * @route GET /
 * @returns {string} Mensaje indicando que la API está activa.
 */
app.get('/', (req, res) => {
  res.send('Hola, esta API está siendo utilizada para crear un restful');
});

/**
 * @brief Ruta para consultar clientes que coincidan con el nombre proporcionado.
 * @route POST /ConsultarClientes
 * @param {string} nombre - Nombre del cliente a buscar.
 * @returns {Array} Clientes que coinciden con el nombre.
 */
app.post('/ConsultarClientes', async (req, res) => {
  try {
    const { nombre } = req.body;
    const response = await ControladorActual.ConsultarClientes(nombre);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al consultar clientes' });
  }
});

/**
 * @brief Ruta para consultar un cliente específico por su ID.
 * @route POST /ConsultarClientesEspecifico
 * @param {number} idActual - ID del cliente a consultar.
 * @returns {Object} Información detallada del cliente.
 */
app.post('/ConsultarClientesEspecifico', async (req, res) => {
  try {
    const { idActual } = req.body;
    const response = await ControladorActual.ConsultarClienteEspecifico(idActual);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar clientes' });
  }
});

/**
 * @brief Ruta para limpiar el almacenamiento en caché de la consulta de clientes.
 * @route POST /LimpiarConsultaClientes
 * @returns {Object} Respuesta vacía indicando éxito.
 */
app.post('/LimpiarConsultaClientes', async (req, res) => {
  try {
    await ControladorActual.LimpiarAlmacenCliente();
    res.json({});
  } catch (error) {
    res.status(500).json({ error: 'Error al limpiar consulta de clientes' });
  }
});

/**
 * @brief Ruta para consultar un proveedor específico por su ID.
 * @route POST /ConsultarProveedorEspecifico
 * @param {number} idActual - ID del proveedor a consultar.
 * @returns {Object} Información detallada del proveedor.
 */
app.post('/ConsultarProveedorEspecifico', async (req, res) => {
  try {
    const { idActual } = req.body;
    const response = await ControladorActual.ConsultarProveedorEspecifico(idActual);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al consultar proveedor' });
  }
});

/**
 * @brief Ruta para limpiar el almacenamiento en caché de la consulta de proveedores.
 * @route POST /LimpiarConsultaProveedores
 * @returns {Object} Respuesta vacía indicando éxito.
 */
app.post('/LimpiarConsultaProveedores', async (req, res) => {
  try {
    await ControladorActual.LimpiarAlmacenProveedores();
    res.json({});
  } catch (error) {
    res.status(500).json({ error: 'Error al limpiar consulta de proveedores' });
  }
});

/**
 * @brief Ruta para consultar proveedores según nombre y categoría.
 * @route POST /ConsultarProveedores
 * @param {string} nombre - Nombre del proveedor.
 * @param {string} categoria - Categoría del proveedor.
 * @returns {Array} Proveedores que coinciden con los criterios.
 */
app.post('/ConsultarProveedores', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.ConsultarProveedores(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar proveedores' });
  }
});

/**
 * @brief Ruta para consultar productos según nombre y grupo.
 * @route POST /ConsultarProductos
 * @param {string} nombre - Nombre del producto.
 * @param {string} grupo - Grupo del producto.
 * @returns {Array} Productos que coinciden con los criterios.
 */
app.post('/ConsultarProductos', async (req, res) => {
  try {
    const { nombre, grupo } = req.body;
    const response = await ControladorActual.ConsultarInventario(nombre, grupo);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

/**
 * @brief Ruta para consultar un producto específico por su ID.
 * @route POST /ConsultarProductoEspecifico
 * @param {number} idActual - ID del producto a consultar.
 * @returns {Object} Información detallada del producto.
 */
app.post('/ConsultarProductoEspecifico', async (req, res) => {
  try {
    const { idActual } = req.body;
    const response = await ControladorActual.ConsultarProductoEspecifico(idActual);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar producto' });
  }
});

/**
 * @brief Ruta para limpiar el almacenamiento en caché de la consulta de productos.
 * @route POST /LimpiarConsultaProductos
 * @returns {Object} Respuesta vacía indicando éxito.
 */
app.post('/LimpiarConsultaProductos', async (req, res) => {
  try {
    const response = await ControladorActual.LimpiarAlmacenInventario();
    res.json({});
  } catch (error) {
    res.status(500).json({ error: 'Error al limpiar consulta de productos' });
  }
});

/**
 * @brief Ruta para consultar facturas según criterios específicos.
 * @route POST /ConsultarVentas
 * @param {string} nombre - Nombre del cliente.
 * @param {string} fechaInicial - Fecha de inicio.
 * @param {string} fechaFinal - Fecha de fin.
 * @param {number} montoInicial - Monto mínimo de la factura.
 * @param {number} montoFinal - Monto máximo de la factura.
 * @returns {Array} Facturas que coinciden con los criterios.
 */
app.post('/ConsultarVentas', async (req, res) => {
  try {
    const { nombre, fechaInicial, fechaFinal, montoInicial, montoFinal } = req.body;
    const response = await ControladorActual.ConsultarFacturas(fechaInicial, fechaFinal, nombre, montoInicial, montoFinal);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar facturas' });
  }
});

/**
 * @brief Ruta para consultar una factura específica por su ID.
 * @route POST /ConsultarVentaEspecifica
 * @param {number} idActual - ID de la factura a consultar.
 * @returns {Object} Información detallada de la factura y sus líneas.
 */
app.post('/ConsultarVentaEspecifica', async (req, res) => {
  try {
    const { idActual } = req.body;
    const response = await ControladorActual.ConsultarFacturaEspecifica(idActual);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar factura' });
  }
});

/**
 * @brief Ruta para limpiar el almacenamiento en caché de la consulta de facturas.
 * @route POST /LimpiarConsultaVentas
 * @returns {Object} Respuesta vacía indicando éxito.
 */
app.post('/LimpiarConsultaVentas', async (req, res) => {
  try {
    const response = await ControladorActual.LimpiarAlmacenFacturas();
    res.json({});
  } catch (error) {
    res.status(500).json({ error: 'Error al limpiar consulta de facturas' });
  }
});

/**
 * @brief Ruta para mostrar estadísticas de proveedores según nombre y categoría.
 * @route POST /MostrarEstadisticasProveedores
 * @param {string} nombre - Nombre del proveedor.
 * @param {string} categoria - Categoría del proveedor.
 * @returns {Array} Estadísticas de los proveedores que coinciden con los criterios.
 */
app.post('/MostrarEstadisticasProveedores', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasProveedores(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de proveedores' });
  }
});

/**
 * @brief Ruta para mostrar estadísticas de clientes según nombre y categoría.
 * @route POST /MostrarEstadisticasClientes
 * @param {string} nombre - Nombre del cliente.
 * @param {string} categoria - Categoría del cliente.
 * @returns {Array} Estadísticas de los clientes que coinciden con los criterios.
 */
app.post('/MostrarEstadisticasClientes', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/MostrarEstadisticasClientes', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/MostrarEstadisticasClientes', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/MostrarEstadisticasClientes', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

// El servidor escucha en el puerto 4000.
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

/**
 * 
 */
app.post('/IniciarSesion', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/InsertarProducto', async (req, res) => {
  try {
    const {
      StockItemName,
      SupplierID,
      ColorID,
      UnitPackageID,
      OuterPackageID,
      Brand,
      Size,
      LeadTimeDays,
      QuantityPerOuter,
      IsChillerStock,
      Barcode,
      TaxRate,
      UnitPrice,
      RecommendedRetailPrice,
      TypicalWeightPerUnit,
      MarketingComments,
      InternalComments,
      Photo,
      CustomFields,
      LastEditedBy,
    } = req.body;
    const response = await ControladorActual.InsertarProducto(
      StockItemName,
      SupplierID,
      ColorID,
      UnitPackageID,
      OuterPackageID,
      Brand,
      Size,
      LeadTimeDays,
      QuantityPerOuter,
      IsChillerStock,
      Barcode,
      TaxRate,
      UnitPrice,
      RecommendedRetailPrice,
      TypicalWeightPerUnit,
      MarketingComments,
      InternalComments,
      Photo,
      CustomFields,
      LastEditedBy
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/ActualizarProducto', async (req, res) => {
  try {
    const {
      StockItemID,
      StockItemName,
      SupplierID,
      ColorID,
      UnitPackageID,
      OuterPackageID,
      Brand,
      Size,
      LeadTimeDays,
      QuantityPerOuter,
      IsChillerStock,
      Barcode,
      TaxRate,
      UnitPrice,
      RecommendedRetailPrice,
      TypicalWeightPerUnit,
      MarketingComments,
      InternalComments,
      Photo,
      CustomFields,
      LastEditedBy,
    } = req.body;
    const response = await ControladorActual.ActualizarProducto(
      StockItemID,
      StockItemName,
      SupplierID,
      ColorID,
      UnitPackageID,
      OuterPackageID,
      Brand,
      Size,
      LeadTimeDays,
      QuantityPerOuter,
      IsChillerStock,
      Barcode,
      TaxRate,
      UnitPrice,
      RecommendedRetailPrice,
      TypicalWeightPerUnit,
      MarketingComments,
      InternalComments,
      Photo,
      CustomFields,
      LastEditedBy
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});

app.post('/EliminarProducto', async (req, res) => {
  try {
    const { nombre, categoria } = req.body;
    const response = await ControladorActual.VerEstadisticasClientes(nombre, categoria);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estadísticas de clientes' });
  }
});