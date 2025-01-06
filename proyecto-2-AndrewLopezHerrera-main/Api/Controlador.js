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
  constructor(sqlServer1, sqlServer2, sqlServer3) {
    this.SQLServer1 = sqlServer1;
    this.SQLServer2 = sqlServer2;
    this.SQLServer3 = sqlServer3;
  }

  /**
   * @method ConsultarClientes
   * @description Consulta los clientes que coinciden con el nombre ingresado.
   * @param {string} nombre - El nombre del cliente a buscar.
   * @returns {Promise<Array>} Una lista de clientes que coinciden con el nombre ingresado.
   */
  async ConsultarClientes(nombre) {
    const request = new this.SQLServer1.Request(); 
    request.input('NombreIngresado', this.SQLServer1.NVarChar, nombre); 
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
    const request = new this.SQLServer1.Request();
    request.input('IDIngresado', this.SQLServer1.Int, id);
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
    const request = new this.SQLServer1.Request();
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
    const request = new this.SQLServer1.Request();
    request.input('Name', this.SQLServer1.NVarChar, nombre);
    request.input('Category', this.SQLServer1.NVarChar, categoria);
    const result = await request.execute('FILTERSUPPLIERS'); 
    return result.recordset;
  }

  /**
   * @method ConsultarProveedorEspecifico
   * @description Consulta toda la información relacionada con un proveedor específico según su ID.
   * @param {number} id - El ID del proveedor.
   * @returns {Promise<Object>} Un objeto que contiene toda la información del proveedor consultado.
   */
  async ConsultarProveedorEspecifico(id) {
    const request = new this.SQLServer1.Request();
    request.input('ID', this.SQLServer1.Int, id);
    const result = await request.execute('SELECTSUPPLIER');
    return result.recordset[0];
  }

  /**
   * @method LimpiarAlmacenProveedores
   * @description Limpia cualquier filtro aplicado previamente a la consulta de proveedores.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenProveedores(){
    const request = new this.SQLServer1.Request();
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
    const request = new this.SQLServer1.Request();
    request.input('Name', this.SQLServer1.NVarChar, nombre);
    request.input('Group', this.SQLServer1.NVarChar, grupo);
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
    const request = new this.SQLServer1.Request();
    request.input('ID', this.SQLServer1.Int, id);
    const result = await request.execute('SELECTSTOCK');
    return result.recordset[0];
  }

  /**
   * @method LimpiarAlmacenInventario
   * @description Limpia cualquier filtro aplicado previamente a la consulta de inventario.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenInventario(){
    const request = new this.SQLServer1.Request();
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
    const request = new this.SQLServer1.Request();
    request.input('InvoiceDateStart', this.SQLServer1.Date, fechaInicial);
    request.input('InvoiceDateEnd', this.SQLServer1.Date, fechaFinal);
    request.input('CustomerName', this.SQLServer1.NVarChar, nombreCliente);
    request.input('MontoInicial', this.SQLServer1.Decimal, montoInicial);
    request.input('MontoFinal', this.SQLServer1.Decimal, montoFinal);
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
    const requestOne = new this.SQLServer1.Request();
    requestOne.input('ID', this.SQLServer1.Int, id);
    const resultOne = await requestOne.execute('SELECTCUSTOMERSALES');
    const requestTwo = new this.SQLServer1.Request();
    requestTwo.input('ID', this.SQLServer1.Int, id);
    const resultTwo = await requestTwo.execute('SELECTLINESINVOICE');
    
    return { factura: resultOne.recordset[0], lineasfactura: resultTwo.recordset };
  }

  /**
   * @method LimpiarAlmacenFacturas
   * @description Limpia cualquier filtro aplicado previamente a la consulta de facturas.
   * @returns {Promise<void>} Indica que la operación de limpieza fue exitosa.
   */
  async LimpiarAlmacenFacturas(){
    const request = new this.SQLServer1.Request();
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
    const request = new this.SQLServer3.Request();
    request.input('CategoryInput', this.SQLServer3.NVarChar, categoria);
    request.input('SupplierNameInput', this.SQLServer3.NVarChar, nombre);
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
    const request = new this.SQLServer3.Request();
    request.input('CategoryNameInput', this.SQLServer3.NVarChar, categoria);
    request.input('CustomerNameInput', this.SQLServer3.NVarChar, nombre);
    const result = await request.execute('WATCHSTATSCUSTOMERS');
    return result.recordset.slice(0, 501);
  }

  async IniciarSesion(nombre, contrasena){
    const request = new this.SQLServer1.Request();
    request.input('@userName', this.SQLServer1.NVarChar, nombre);
    request.input('@passwordUser', this.SQLServer1.NVarChar, contrasena);
    const result = await request.execute('loginUser');
    return result.recordset[0];
  }

  async ActualizarProducto(
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
  ) {
    const request = new this.SQL.Request();
    request.input('@StockItemID', this.SQL.Int, StockItemID);
    request.input('@StockItemName', this.SQL.NVarChar(100), StockItemName);
    request.input('@SupplierID', this.SQL.Int, SupplierID);
    request.input('@ColorID', this.SQL.Int, ColorID);
    request.input('@UnitPackageID', this.SQL.Int, UnitPackageID);
    request.input('@OuterPackageID', this.SQL.Int, OuterPackageID);
    request.input('@Brand', this.SQL.NVarChar(50), Brand);
    request.input('@Size', this.SQL.NVarChar(20), Size);
    request.input('@LeadTimeDays', this.SQL.Int, LeadTimeDays);
    request.input('@QuantityPerOuter', this.SQL.Int, QuantityPerOuter);
    request.input('@IsChillerStock', this.SQL.Bit, IsChillerStock);
    request.input('@Barcode', this.SQL.NVarChar(50), Barcode);
    request.input('@TaxRate', this.SQL.Decimal(18, 3), TaxRate);
    request.input('@UnitPrice', this.SQL.Decimal(18, 2), UnitPrice);
    request.input('@RecommendedRetailPrice', this.SQL.Decimal(18, 2), RecommendedRetailPrice);
    request.input('@TypicalWeightPerUnit', this.SQL.Decimal(18, 3), TypicalWeightPerUnit);
    request.input('@MarketingComments', this.SQL.NVarChar(this.SQL.MAX), MarketingComments);
    request.input('@InternalComments', this.SQL.NVarChar(this.SQL.MAX), InternalComments);
    request.input('@Photo', this.SQL.VarBinary(this.SQL.MAX), Photo);
    request.input('@CustomFields', this.SQL.NVarChar(this.SQL.MAX), CustomFields);
    request.input('@LastEditedBy', this.SQL.Int, LastEditedBy);
    const result = await request.execute('UPDATESTOCKITEM');
    return result.recordset[0];
  }

  async InsertarProducto(
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
  ) {
    const request = new this.SQLServer1.Request();
    request.input('StockItemName', this.SQLServer1.NVarChar(100), StockItemName);
    request.input('SupplierID', this.SQLServer1.Int, SupplierID);
    request.input('ColorID', this.SQLServer1.Int, ColorID);
    request.input('UnitPackageID', this.SQLServer1.Int, UnitPackageID);
    request.input('OuterPackageID', this.SQLServer1.Int, OuterPackageID);
    request.input('Brand', this.SQLServer1.NVarChar(50), Brand);
    request.input('Size', this.SQLServer1.NVarChar(20), Size);
    request.input('LeadTimeDays', this.SQLServer1.Int, LeadTimeDays);
    request.input('QuantityPerOuter', this.SQLServer1.Int, QuantityPerOuter);
    request.input('IsChillerStock', this.SQLServer1.Bit, IsChillerStock);
    request.input('Barcode', this.SQLServer1.NVarChar(50), Barcode);
    request.input('TaxRate', this.SQLServer1.Decimal(18, 3), TaxRate);
    request.input('UnitPrice', this.SQLServer1.Decimal(18, 2), UnitPrice);
    request.input('RecommendedRetailPrice', this.SQLServer1.Decimal(18, 2), RecommendedRetailPrice);
    request.input('TypicalWeightPerUnit', this.SQLServer1.Decimal(18, 3), TypicalWeightPerUnit);
    request.input('MarketingComments', this.SQLServer1.NVarChar(this.SQL.MAX), MarketingComments);
    request.input('InternalComments', this.SQLServer1.NVarChar(this.SQL.MAX), InternalComments);
    request.input('Photo', this.SQLServer1.VarBinary(this.SQL.MAX), Photo);
    request.input('CustomFields', this.SQLServer1.NVarChar(this.SQL.MAX), CustomFields);
    request.input('LastEditedBy', this.SQLServer1.Int, LastEditedBy);
    const result = await request.execute('INSERTSTOCKITEM');
    return result.recordset[0];
  }
  

  async EliminarProducto(stockItemid){
    const request = new this.SQLServer1.Request();
    request.input('@StockItemID', this.SQLServer1.Int, stockItemid);
    const result = await request.execute('loginUser');
    return result.recordset[0];
  }
}

module.exports = Controlador;
