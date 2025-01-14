const { sql } = require('./dbconfig');

/**
 * @class Controlador
 * @description Esta clase actúa como el controlador principal de la aplicación, 
 * encargándose de gestionar las solicitudes de datos desde un servidor SQLServer. 
 * Proporciona varios métodos para consultar y gestionar información de clientes, 
 * proveedores, productos, facturas y estadísticas.
 */
class Controlador {

  /**
   * @constructor
   * @description Inicializa una nueva instancia del controlador con la configuración SQL proporcionada.
   * @param {object} sql - Objeto de configuración para la conexión a SQLServer.
   */
  constructor(sql) {
    this.SQL = sql;
  }

  /**
   * @method ConsultarClientes
   * @description Consulta los clientes que coinciden con el nombre ingresado.
   * @param {string} nombre - El nombre del cliente a buscar.
   * @returns {Promise<Array>} Una lista de clientes que coinciden con el nombre ingresado.
   */
  async ConsultarClientes(nombre) {
    const request = new this.SQL.Request(); 
    request.input('NombreIngresado', this.SQL.NVarChar, nombre); 
    const result = await request.execute('FILTERCLI'); 
    return result.recordset;
  }

  /**
   * @method ConsultarClienteEspecifico
   * @description Consulta toda la información relacionada con un cliente específico según su ID.
   * @param {number} id - El ID del cliente.
   * @returns {Promise<Object>} Un objeto que contiene toda la información del cliente consultado.
   */
  async ConsultarClienteEspecifico(id) {
    const request = new this.SQL.Request();
    request.input('IDIngresado', this.SQL.Int, id);
    const result = await request.execute('SELECTCLI');
    const cliente = result.recordset[0];
    return cliente;
  }

  /**
   * @method LimpiarAlmacenCliente
   * @description Limpia cualquier filtro aplicado previamente a la consulta de clientes.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenCliente(){
    const request = new this.SQL.Request();
    await request.execute('CLEARCLIFILTER');
  }

  /**
   * @method ConsultarProveedores
   * @description Consulta los proveedores que coinciden con el nombre y la categoría ingresados.
   * @param {string} nombre - El nombre del proveedor a buscar.
   * @param {string} categoria - La categoría del proveedor a buscar.
   * @returns {Promise<Array>} Una lista de proveedores que coinciden con los filtros aplicados.
   */
  async ConsultarProveedores(nombre, categoria) {
    const request = new this.SQL.Request();
    request.input('Name', this.SQL.NVarChar, nombre);
    request.input('Category', this.SQL.NVarChar, categoria);
    const result = await request.execute('FILTERSUPPLIERS'); 
    if (nombre !== "" && categoria !== "") {
      return this.AlmacenProveedores.AgregarElementos(result.recordset);
    }
    return result.recordset;
  }

  /**
   * @method ConsultarProveedorEspecifico
   * @description Consulta toda la información relacionada con un proveedor específico según su ID.
   * @param {number} id - El ID del proveedor.
   * @returns {Promise<Object>} Un objeto que contiene toda la información del proveedor consultado.
   */
  async ConsultarProveedorEspecifico(id) {
    const request = new this.SQL.Request();
    request.input('ID', this.SQL.Int, id);
    const result = await request.execute('SELECTSUPPLIER');
    return result.recordset[0];
  }

  /**
   * @method LimpiarAlmacenProveedores
   * @description Limpia cualquier filtro aplicado previamente a la consulta de proveedores.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenProveedores(){
    const request = new this.SQL.Request();
    await request.execute('CLEARCUSFILTER');
  }

  /**
   * @method ConsultarInventario
   * @description Consulta los productos en el inventario que coinciden con el nombre y el grupo ingresados.
   * @param {string} nombre - El nombre del producto.
   * @param {string} grupo - El grupo al que pertenece el producto.
   * @returns {Promise<Array>} Una lista de productos que coinciden con los filtros aplicados.
   */
  async ConsultarInventario(nombre, grupo) {
    const request = new this.SQL.Request();
    request.input('Name', this.SQL.NVarChar, nombre);
    request.input('Group', this.SQL.NVarChar, grupo);
    const result = await request.execute('FILTERSTOCK');
    return result.recordset;
  }

  /**
   * @method ConsultarProductoEspecifico
   * @description Consulta toda la información relacionada con un producto específico según su ID.
   * @param {number} id - El ID del producto.
   * @returns {Promise<Object>} Un objeto que contiene toda la información del producto consultado.
   */
  async ConsultarProductoEspecifico(id) {
    const request = new this.SQL.Request();
    request.input('ID', this.SQL.Int, id);
    const result = await request.execute('SELECTSTOCK');
    return result.recordset[0];
  }

  /**
   * @method LimpiarAlmacenInventario
   * @description Limpia cualquier filtro aplicado previamente a la consulta de inventario.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenInventario(){
    const request = new this.SQL.Request();
    await request.execute('CLEARSTSTFILTER');
  }

  /**
   * @method ConsultarFacturas
   * @description Consulta facturas que coinciden con los filtros aplicados.
   * @param {string} fechaInicial - Fecha de inicio para el filtro.
   * @param {string} fechaFinal - Fecha de fin para el filtro.
   * @param {string} nombreCliente - Nombre del cliente.
   * @param {number} montoInicial - Monto inicial para el filtro.
   * @param {number} montoFinal - Monto final para el filtro.
   * @returns {Promise<Array>} Una lista de facturas que coinciden con los criterios de búsqueda.
   */
  async ConsultarFacturas(fechaInicial, fechaFinal, nombreCliente, montoInicial, montoFinal) {
    const request = new this.SQL.Request();
    request.input('InvoiceDateStart', this.SQL.Date, fechaInicial);
    request.input('InvoiceDateEnd', this.SQL.Date, fechaFinal);
    request.input('CustomerName', this.SQL.NVarChar, nombreCliente);
    request.input('MontoInicial', this.SQL.Decimal, montoInicial);
    request.input('MontoFinal', this.SQL.Decimal, montoFinal);
    const result = await request.execute('FILTERINVOICES');
    return result.recordset.slice(0, 501);
  }

  /**
   * @method ConsultarFacturaEspecifica
   * @description Consulta toda la información relacionada con una factura específica y sus líneas.
   * @param {number} id - El ID de la factura.
   * @returns {Promise<Object>} Un objeto que contiene la factura y las líneas de la misma.
   */
  async ConsultarFacturaEspecifica(id) {
    const requestOne = new this.SQL.Request();
    requestOne.input('ID', this.SQL.Int, id);
    const resultOne = await requestOne.execute('SELECTCUSTOMERSALES');
    
    const requestTwo = new this.SQL.Request();
    requestTwo.input('ID', this.SQL.Int, id);
    const resultTwo = await requestTwo.execute('SELECTLINESINVOICE');
    
    return { factura: resultOne.recordset[0], lineasfactura: resultTwo.recordset };
  }

  /**
   * @method LimpiarAlmacenFacturas
   * @description Limpia cualquier filtro aplicado previamente a la consulta de facturas.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenFacturas(){
    const request = new this.SQL.Request();
    await request.execute('CLEARINVFILTER');
  }

  /**
   * @method VerEstadisticasProveedores
   * @description Consulta estadísticas de proveedores que coinciden con el nombre y la categoría ingresados.
   * @param {string} nombre - El nombre del proveedor.
   * @param {string} categoria - La categoría del proveedor.
   * @returns {Promise<Array>} Estadísticas de los proveedores que coinciden con los filtros aplicados.
   */
  async VerEstadisticasProveedores(nombre, categoria) {
    const request = new this.SQL.Request();
    request.input('CategoryInput', this.SQL.NVarChar, categoria);
    request.input('SupplierNameInput', this.SQL.NVarChar, nombre);
    const result = await request.execute('WATCHSTATSSUPPLIERS');
    return result.recordset;
  }

  /**
   * @method VerEstadisticasClientes
   * @description Consulta estadísticas de clientes que coinciden con el nombre y la categoría ingresados.
   * @param {string} nombre - El nombre del cliente.
   * @param {string} categoria - La categoría del cliente.
   * @returns {Promise<Array>} Estadísticas de los clientes que coinciden con los filtros aplicados.
   */
  async VerEstadisticasClientes(nombre, categoria) {
    const request = new this.SQL.Request();
    request.input('CategoryNameInput', this.SQL.NVarChar, categoria);
    request.input('CustomerNameInput', this.SQL.NVarChar, nombre);
    const result = await request.execute('WATCHSTATSCUSTOMERS');
    return result.recordset.slice(0, 501);
  }
}

module.exports = Controlador;
