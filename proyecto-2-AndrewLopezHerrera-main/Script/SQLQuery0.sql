USE WideWorldImporters;

-- Crear sinónimos para facilitar el acceso a las tablas de la base de datos.
CREATE SYNONYM CLI FOR Sales.Customers;
CREATE SYNONYM CLICAT FOR Sales.CustomerCategories;
CREATE SYNONYM DEMET FOR Application.DeliveryMethods;
CREATE SYNONYM SABU FOR Sales.BuyingGroups;
CREATE SYNONYM APPE FOR Application.People;
CREATE SYNONYM APCI FOR Application.Cities;

-- Crear vista ALLCLI para obtener la información básica de los clientes, uniendo las tablas Sales.Customers, 
-- Sales.CustomerCategories y Application.DeliveryMethods para mostrar el ID, nombre, categoría y método de entrega.
GO
CREATE VIEW ALLCLI AS
    SELECT 
        CLI.CustomerID AS ID,
        CLI.CustomerName AS Nombre,
        CLICAT.CustomerCategoryName AS Categoria,
        DEMET.DeliveryMethodName AS MetodoEntrega
    FROM
        CLI
    INNER JOIN
        CLICAT ON CLI.CustomerCategoryID = CLICAT.CustomerCategoryID
    INNER JOIN
        DEMET ON CLI.DeliveryMethodID = DEMET.DeliverodID;

-- Crear tabla CustomerStore para almacenar temporalmente los datos filtrados de clientes.
CREATE TABLE CustomerStore(
	ID INT PRIMARY KEY,
	Nombre VARCHAR(100),
	Categoria VARCHAR(100),
	MetodoEntrega VARCHAR(100)
)

-- Crear un sinónimo para la tabla CustomerStore.
CREATE SYNONYM CUSSTO FOR CustomerStore;

GO

-- Crear procedimiento almacenado FILTERCLI para filtrar clientes por nombre.
-- Este procedimiento permite la inserción de resultados en CustomerStore si el nombre ingresado coincide.
CREATE PROCEDURE FILTERCLI
    @NombreIngresado NVARCHAR(100) = NULL  -- Parámetro opcional para buscar clientes por nombre.
WITH EXECUTE AS 'dbo'
AS
BEGIN
    -- Si el nombre no es vacío, inserta en CustomerStore los clientes que coinciden con el nombre ingresado.
    IF @NombreIngresado <> ''
    BEGIN
        INSERT INTO CUSSTO (ID, Nombre, Categoria, MetodoEntrega)
        SELECT 
            ID, Nombre, Categoria, MetodoEntrega
        FROM
            ALLCLI
        WHERE
            (@NombreIngresado IS NULL OR Nombre LIKE '%' + @NombreIngresado + '%')  -- Coincidencia parcial del nombre.
            AND NOT EXISTS (  -- Evitar duplicados en CustomerStore.
                SELECT 1
                FROM CustomerStore c
                WHERE c.ID = ALLCLI.ID
            );
        
        -- Seleccionar y ordenar todos los registros de CustomerStore por nombre.
		SELECT
        *
		FROM
			CUSSTO
		ORDER BY
			Nombre;
    END
    ELSE
    BEGIN
        -- Si el nombre ingresado está vacío, seleccionar y mostrar todos los clientes desde ALLCLI.
        SELECT
        *
		FROM
			ALLCLI
		ORDER BY
			Nombre;
	END
END;

GO

-- Crear procedimiento almacenado CLEARCLIFILTER para limpiar los datos de CustomerStore.
CREATE PROCEDURE CLEARCLIFILTER
WITH EXECUTE AS 'dbo'
AS
BEGIN
	DELETE CUSSTO;  -- Elimina todos los registros de CustomerStore.
END

GO

-- Crear vista JOINALLDATACLI para obtener toda la información detallada de los clientes.
-- Esta vista realiza múltiples uniones con otras tablas relacionadas para obtener detalles adicionales
-- como contactos, grupo de compra, datos de entrega, dirección y ubicación.
CREATE VIEW JOINALLDATACLI AS
    SELECT
        CLI.CustomerID AS ID,
        CLI.CustomerName AS Nombre,
        CLICAT.CustomerCategoryName AS NombreCategoria,
        DEMET.DeliveryMethodName AS MetodoEntrega,
        SABU.BuyingGroupName AS GrupoCompra,
        APPEPR.FullName AS ContactoPrimario,
        APPEAL.FullName AS ContactoAlternativo,
        CLIAUX.CustomerName AS ClienteFacturar,
        APCI.CityName AS CiudadEntrega,
        CLI.PostalPostalCode AS CodigoPostal,
        CLI.PhoneNumber AS Telefono,
        CLI.FaxNumber AS FAX,
        CLI.PaymentDays AS DiasGracia,
        CLI.WebsiteURL AS PaginaWeb,
        CLI.DeliveryAddressLine1 AS DireccionLinea1,
        CLI.DeliveryAddressLine2 AS DireccionLinea2,
        CLI.PostalAddressLine1 AS DireccionPostal1,
		CLI.PostalAddressLine2 AS DireccionPostal2,
        CLI.DeliveryLocation AS Localizacion
    FROM
        CLI
    LEFT JOIN CLICAT ON CLI.CustomerCategoryID = CLICAT.CustomerCategoryID  -- Unión izquierda con categorías de cliente.
    LEFT JOIN SABU ON CLI.BuyingGroupID = SABU.BuyingGroupID  -- Unión izquierda con grupos de compra.
    LEFT JOIN APPE AS APPEPR ON CLI.PrimaryContactPersonID = APPEPR.PersonID  -- Unión izquierda con el contacto primario.
    LEFT JOIN APPE AS APPEAL ON CLI.AlternateContactPersonID = APPEAL.PersonID  -- Unión izquierda con el contacto alternativo.
    LEFT JOIN CLI AS CLIAUX ON CLI.BillToCustomerID = CLIAUX.CustomerID  -- Unión izquierda con el cliente facturable.
    LEFT JOIN DEMET ON CLI.DeliveryMethodID = DEMET.DeliveryMethodID  -- Unión izquierda con métodos de entrega.
    LEFT JOIN APCI ON CLI.DeliveryCityID = APCI.CityID;  -- Unión izquierda con las ciudades de entrega.

GO

-- Crear procedimiento almacenado SELECTCLI para obtener información detallada de un cliente específico 
-- utilizando el ID ingresado como parámetro.
CREATE PROCEDURE SELECTCLI
@IDIngresado int = NULL  -- Parámetro para especificar el ID del cliente.
WITH EXECUTE AS 'dbo'
AS
BEGIN
	SELECT
		*
	FROM
		JOINALLDATACLI  -- Seleccionar desde la vista JOINALLDATACLI.
	WHERE
		JOINALLDATACLI.ID = @IDIngresado  -- Filtrar por el ID del cliente.
END

--Modulo Proveedores

USE WideWorldImporters;

-- Crear sinónimos para facilitar la referencia a las tablas de proveedores y categorías de proveedores.
CREATE SYNONYM PUSU FOR Purchasing.Suppliers;
CREATE SYNONYM PUSUCA FOR Purchasing.SupplierCategories;

GO

-- Crear vista JOINALLDATASUPLIERS para obtener toda la información relevante de los proveedores,
-- incluyendo detalles como contacto, método de entrega, dirección y detalles bancarios.
CREATE VIEW JOINALLDATASUPLIERS AS
	SELECT
		PUSU.SupplierID AS ID,
		PUSU.SupplierReference AS CodigoProveedor,
		PUSU.SupplierName AS NombreProveedor,
		PUSUCA.SupplierCategoryName AS CategoriaProveedor,
		APPEPR.FullName AS ContactoPrimario,
		APPEAL.FullName AS ContactoAlternativo,
		DEMET.DeliveryMethodName AS MetodoEntrega,
		APCI.CityName AS CiudadEntrega,
		PUSU.PostalPostalCode AS CodigoPostal,
		PUSU.PhoneNumber AS Telefono,
		PUSU.FaxNumber AS FAX,
		PUSU.WebsiteURL AS SitioWeb,
		PUSU.DeliveryAddressLine1 AS DireccionEntrega1,
		PUSU.DeliveryAddressLine2 AS DireccionEntrega2,
		PUSU.PostalAddressLine1 AS DireccionPostal1,
		PUSU.PostalAddressLine2 AS DireccionPostal2,
		PUSU.DeliveryLocation AS Localizacion,
		PUSU.BankAccountName AS NombreBanco,
		PUSU.BankAccountNumber AS NumeroCuentaBanco,
		PUSU.PaymentDays AS DiasGraciaPago
	FROM
		PUSU
	LEFT JOIN PUSUCA ON PUSU.SupplierCategoryID = PUSUCA.SupplierCategoryID
	LEFT JOIN APPE AS APPEPR ON PUSU.PrimaryContactPersonID = APPEPR.PersonID
	LEFT JOIN APPE AS APPEAL ON PUSU.AlternateContactPersonID = APPEAL.PersonID
	LEFT JOIN DEMET ON PUSU.DeliveryMethodID = DEMET.DeliveryMethodID
	LEFT JOIN APCI ON PUSU.DeliveryCityID = APCI.CityID;

GO

-- Crear tabla SUPPLIERSSTORE para almacenar temporalmente proveedores filtrados.
CREATE TABLE SUPPLIERSSTORE
(
	ID INT PRIMARY KEY,
	NombreProveedor VARCHAR(100),
	CategoriaProveedor VARCHAR(100),
	MetodoEntrega VARCHAR(100)
);

-- Crear sinónimo para facilitar las referencias a SUPPLIERSSTORE.
CREATE SYNONYM SUSS FOR SUPPLIERSSTORE;

GO

-- Procedimiento almacenado FILTERSUPPLIERS para filtrar proveedores por nombre y/o categoría.
CREATE PROCEDURE FILTERSUPPLIERS
@Name varchar(100) = NULL,
@Category varchar(100) = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	-- Si se ingresa nombre o categoría, insertar en SUPPLIERSSTORE los resultados filtrados.
	IF @Name <> '' OR @Category <> ''
	BEGIN
		INSERT INTO SUSS
		SELECT
			JOINALLDATASUPLIERS.ID,
			JOINALLDATASUPLIERS.NombreProveedor,
			JOINALLDATASUPLIERS.CategoriaProveedor,
			JOINALLDATASUPLIERS.MetodoEntrega
		FROM
			JOINALLDATASUPLIERS
		WHERE
			(@Name IS NULL OR JOINALLDATASUPLIERS.NombreProveedor LIKE '%' + @Name + '%')
			AND (@Category IS NULL OR JOINALLDATASUPLIERS.CategoriaProveedor LIKE '%' + @Category + '%')
			AND NOT EXISTS (
                SELECT 1
                FROM SUSS c
                WHERE c.ID = JOINALLDATASUPLIERS.ID
            );

		-- Mostrar los resultados filtrados.
		SELECT *
		FROM SUSS
		ORDER BY SUSS.NombreProveedor;
	END
	ELSE
	BEGIN
		-- Si no se ingresa ningún filtro, mostrar todos los proveedores.
		SELECT
			JOINALLDATASUPLIERS.ID,
			JOINALLDATASUPLIERS.NombreProveedor,
			JOINALLDATASUPLIERS.CategoriaProveedor,
			JOINALLDATASUPLIERS.MetodoEntrega
		FROM JOINALLDATASUPLIERS
		ORDER BY JOINALLDATASUPLIERS.NombreProveedor;
	END
END;

GO

-- Procedimiento almacenado SELECTSUPPLIER para obtener la información detallada de un proveedor por su ID.
CREATE PROCEDURE SELECTSUPPLIER
@ID int = NULL
AS
BEGIN
	SELECT *
	FROM JOINALLDATASUPLIERS
	WHERE JOINALLDATASUPLIERS.ID = @ID
END

-- Ejecutar procedimiento para obtener el proveedor con ID = 10.
exec SELECTSUPPLIER @ID = 10;

GO

-- Procedimiento almacenado CLEARCUSFILTER para limpiar la tabla SUPPLIERSSTORE.
CREATE PROCEDURE CLEARCUSFILTER
WITH EXECUTE AS 'dbo'
AS
BEGIN
	DELETE SUSS;  -- Eliminar todos los registros de SUPPLIERSSTORE.
END

--Módulo Inventario

USE WideWorldImporters;

-- Crear sinónimos para facilitar la referencia a las tablas relacionadas con los artículos de stock, tipos de paquetes, 
-- grupos de stock, colores y proveedores.
CREATE SYNONYM WASTO FOR Warehouse.StockItems;
CREATE SYNONYM PATY FOR Warehouse.PackageTypes;
CREATE SYNONYM WASTOHO FOR Warehouse.StockItemHoldings;
CREATE SYNONYM WASTOSTOGR FOR Warehouse.StockItemStockGroups;
CREATE SYNONYM WASTOGR FOR Warehouse.StockGroups;
CREATE SYNONYM WACO FOR Warehouse.Colors;

GO

-- Crear vista JOINALLDATASTOCK para obtener toda la información relevante de los artículos de stock,
-- como el nombre del producto, proveedor, color, precio, peso, cantidad disponible, etc.
CREATE VIEW JOINALLDATASTOCK AS
	SELECT
		WASTO.StockItemID AS ID,
		WASTO.StockItemName AS NombreProducto,
		WASTOGR.StockGroupName AS Grupo,
		PUSU.SupplierName AS NombreProveedor,
		PUSU.WebsiteURL AS SitioWebProveedor,
		WACO.ColorName AS Color,
		PATYUN.PackageTypeName AS UnidadEmpaquetamiento,
		PATYOU.PackageTypeName AS Empaquetamiento,
		WASTO.RecommendedRetailPrice AS PrecioVenta,
		WASTO.TypicalWeightPerUnit AS Peso,
		WASTO.SearchDetails AS PalabrasClave,
		WASTO.QuantityPerOuter AS CantidadEmpaquetamiento,
		WASTO.Brand AS Marca,
		WASTO.Size AS Talla,
		FORMAT((WASTO.TaxRate / 100) * WASTO.UnitPrice, 'N4') AS Impuesto,
		WASTO.UnitPrice AS PrecioUnitario,
		WASTOHO.QuantityOnHand AS CantidadDisponible,
		WASTOHO.BinLocation AS Ubicacion
	FROM
		WASTO
	LEFT JOIN
		PUSU ON WASTO.SupplierID = PUSU.SupplierID
	LEFT JOIN
		WASTOHO ON WASTO.StockItemID = WASTOHO.StockItemID
	LEFT JOIN
		WACO ON WASTO.ColorID = WACO.ColorID
	LEFT JOIN
		WASTOSTOGR ON WASTO.StockItemID = WASTOSTOGR.StockItemID
	LEFT JOIN
		WASTOGR ON WASTOGR.StockGroupID = WASTOSTOGR.StockGroupID
	LEFT JOIN
		PATY AS PATYUN ON WASTO.UnitPackageID = PATYUN.PackageTypeID
	LEFT JOIN
		PATY AS PATYOU ON WASTO.OuterPackageID = PATYOU.PackageTypeID;

GO

-- Crear tabla STOCKSTORE para almacenar temporalmente artículos de stock filtrados.
CREATE TABLE STOCKSTORE
(
	ID INT PRIMARY KEY,
	NombreProducto VARCHAR(100),
	Grupo VARCHAR(100),
	CantidadDisponible INT
);

-- Crear sinónimo para facilitar las referencias a STOCKSTORE.
CREATE SYNONYM STST FOR STOCKSTORE;

GO

-- Procedimiento almacenado FILTERSTOCK para filtrar productos por nombre y/o grupo.
CREATE PROCEDURE FILTERSTOCK
@Name varchar(100) = NULL,
@Group varchar(100) = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	-- Si se ingresa nombre o grupo, insertar en STOCKSTORE los resultados filtrados.
	IF @Name <> '' OR @Group <> ''
	BEGIN
		INSERT INTO STST
		SELECT
			JOINALLDATASTOCK.ID,
			JOINALLDATASTOCK.NombreProducto,
			STRING_AGG(JOINALLDATASTOCK.Grupo, ', ') AS Grupo,
			JOINALLDATASTOCK.CantidadDisponible
		FROM
			JOINALLDATASTOCK
		WHERE
			(@Name IS NULL OR JOINALLDATASTOCK.NombreProducto LIKE '%' + @Name + '%')
			AND (@Group IS NULL OR JOINALLDATASTOCK.Grupo LIKE '%' + @Group + '%')
			AND NOT EXISTS (
                SELECT 1
                FROM STST c
                WHERE c.ID = JOINALLDATASTOCK.ID
            )
		GROUP BY
			JOINALLDATASTOCK.ID,
			JOINALLDATASTOCK.NombreProducto,
			JOINALLDATASTOCK.CantidadDisponible;
		
		-- Mostrar los productos filtrados.
		SELECT *
		FROM STST
		ORDER BY NombreProducto;
	END
	ELSE
	BEGIN
		-- Si no se ingresa ningún filtro, mostrar todos los productos.
		SELECT
			JOINALLDATASTOCK.ID,
			JOINALLDATASTOCK.NombreProducto,
			STRING_AGG(JOINALLDATASTOCK.Grupo, ', ') AS Grupo,
			JOINALLDATASTOCK.CantidadDisponible
		FROM JOINALLDATASTOCK
		GROUP BY JOINALLDATASTOCK.ID,
				 JOINALLDATASTOCK.NombreProducto,
				 JOINALLDATASTOCK.CantidadDisponible
		ORDER BY NombreProducto;
	END
END

GO

-- Procedimiento almacenado SELECTSTOCK para obtener la información detallada de un producto por su ID.
CREATE PROCEDURE SELECTSTOCK
@ID int = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	SELECT *
	FROM JOINALLDATASTOCK
	WHERE @ID = JOINALLDATASTOCK.ID;
END

-- Ejecutar procedimiento para obtener el producto con ID = 97.
exec SELECTSTOCK @ID = 97;

GO

-- Procedimiento almacenado CLEARSTSTFILTER para limpiar la tabla STOCKSTORE.
CREATE PROCEDURE CLEARSTSTFILTER
WITH EXECUTE AS 'dbo'
AS
BEGIN
	DELETE STST;  -- Eliminar todos los registros de STOCKSTORE.
END

--Módulo ventas
USE WideWorldImporters;

-- Crear sinónimos para las tablas relacionadas con facturas e ítems de factura.
CREATE SYNONYM SAIN FOR [Sales].[Invoices];
CREATE SYNONYM SAINLI FOR [Sales].[InvoiceLines];

GO

-- Crear vista JOINALLDATAINVOICES que unifica información sobre facturas y clientes.
CREATE VIEW JOINALLDATAINVOICES AS
	SELECT
		SAIN.InvoiceID AS ID,
		CLI.CustomerID AS ClienteID,
		CLI.CustomerName AS NombreCliente,
		CLI.WebsiteURL AS SitioWeb,
		DEMET.DeliveryMethodName AS MetodoEntrega,
		SAIN.CustomerPurchaseOrderNumber AS NumeroOrden,
		APPECO.FullName AS PersonaContacto,
		APPESA.FullName AS Vendedor,
		SAIN.InvoiceDate AS FechaFactura,
		SAIN.DeliveryInstructions AS InstruccionesEntrega
	FROM
		SAIN
	LEFT JOIN
		CLI ON SAIN.CustomerID = CLI.CustomerID
	LEFT JOIN
		DEMET ON SAIN.DeliveryMethodID = DEMET.DeliveryMethodID
	LEFT JOIN
		APPE AS APPECO ON SAIN.ContactPersonID = APPECO.PersonID
	LEFT JOIN
		APPE AS APPESA ON SAIN.SalespersonPersonID = APPESA.PersonID;

GO

-- Crear vista LINESINVOICES que unifica información sobre los ítems de cada factura.
CREATE VIEW LINESINVOICES AS
	SELECT
		SAIN.InvoiceID AS ID,
		WASTO.StockItemName AS NombreProducto,
		SAINLI.Quantity AS Cantidad,
		WASTO.UnitPrice AS PrecioUnitario,
		STR(CONVERT(INT, WASTO.TaxRate)) + '%' AS ImpuestoAplicado,
		FORMAT((WASTO.TaxRate / 100) * WASTO.UnitPrice, 'N4') AS MontoImpuesto,
		((WASTO.TaxRate / 100) * WASTO.UnitPrice + WASTO.UnitPrice) * SAINLI.Quantity AS TotalLinea
	FROM
		SAIN
	LEFT JOIN
		CLI ON SAIN.CustomerID = CLI.CustomerID
	LEFT JOIN
		SAINLI ON SAIN.InvoiceID = SAINLI.InvoiceID
	LEFT JOIN
		WASTO ON SAINLI.StockItemID = WASTO.StockItemID;

GO

-- Procedimiento almacenado SELECTCUSTOMERSALES para obtener los detalles de una factura por su ID.
CREATE PROCEDURE SELECTCUSTOMERSALES
@ID int = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	SELECT *
	FROM JOINALLDATAINVOICES
	WHERE @ID = JOINALLDATAINVOICES.ID;
END

GO

-- Procedimiento almacenado SELECTLINESINVOICE para obtener los detalles de los ítems de una factura por su ID.
CREATE PROCEDURE SELECTLINESINVOICE
@ID int = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	SELECT *
	FROM LINESINVOICES
	WHERE @ID = LINESINVOICES.ID;
END

GO

-- Crear tabla INVOICESSTORE para almacenar facturas filtradas temporalmente.
CREATE TABLE INVOICESSTORE
(
	ID INT PRIMARY KEY,
	NombreCliente VARCHAR(100),
	SitioWeb VARCHAR(100),
	FechaFactura DATE,
	MetodoEntrega VARCHAR(100),
	MONTO INT
);

-- Crear sinónimo para INVOICESSTORE.
CREATE SYNONYM INST FOR INVOICESSTORE;

GO

-- Procedimiento almacenado FILTERINVOICES para filtrar facturas según diferentes criterios.
CREATE PROCEDURE FILTERINVOICES 
@InvoiceDateStart Date = NULL,
@InvoiceDateEnd Date = NULL,
@CustomerName varchar(100) = NULL,
@MontoInicial int = NULL,
@MontoFinal int = NULL
WITH EXECUTE AS 'dbo'
AS
BEGIN
	IF @CustomerName <> '' OR @InvoiceDateStart IS NOT NULL OR @InvoiceDateEnd IS NOT NULL
		OR @MontoInicial IS NOT NULL OR @MontoFinal IS NOT NULL
	BEGIN
		-- Insertar las facturas que cumplen los filtros en INVOICESSTORE.
		INSERT INTO INST
		SELECT
			JOINALLDATAINVOICES.ID,
			JOINALLDATAINVOICES.NombreCliente,
			JOINALLDATAINVOICES.SitioWeb,
			JOINALLDATAINVOICES.FechaFactura,
			JOINALLDATAINVOICES.MetodoEntrega,
			SUM(LINESINVOICES.TotalLinea) AS MONTO
		FROM
			JOINALLDATAINVOICES
		INNER JOIN
			LINESINVOICES ON JOINALLDATAINVOICES.ID = LINESINVOICES.ID
		WHERE
			(@InvoiceDateStart IS NULL OR JOINALLDATAINVOICES.FechaFactura > @InvoiceDateStart)
			AND (@InvoiceDateEnd IS NULL OR JOINALLDATAINVOICES.FechaFactura < @InvoiceDateEnd)
			AND (@CustomerName IS NULL OR JOINALLDATAINVOICES.NombreCliente LIKE '%' + @CustomerName + '%')
			AND NOT EXISTS (
				SELECT 1
				FROM INST c
				WHERE c.ID = JOINALLDATAINVOICES.ID
			)
		GROUP BY
			JOINALLDATAINVOICES.ID,
			JOINALLDATAINVOICES.NombreCliente,
			JOINALLDATAINVOICES.SitioWeb,
			JOINALLDATAINVOICES.FechaFactura,
			JOINALLDATAINVOICES.MetodoEntrega
		HAVING
			(@MontoInicial IS NULL OR SUM(LINESINVOICES.TotalLinea) >= @MontoInicial)
			AND (@MontoFinal IS NULL OR SUM(LINESINVOICES.TotalLinea) < @MontoFinal);
		
		-- Mostrar facturas filtradas.
		SELECT *
		FROM INST
		ORDER BY NombreCliente;
	END
	ELSE
	BEGIN
		-- Mostrar todas las facturas si no hay filtros.
		SELECT
			JOINALLDATAINVOICES.ID,
			JOINALLDATAINVOICES.NombreCliente,
			JOINALLDATAINVOICES.SitioWeb,
			JOINALLDATAINVOICES.FechaFactura,
			JOINALLDATAINVOICES.MetodoEntrega,
			SUM(LINESINVOICES.TotalLinea) AS MONTO
		FROM
			JOINALLDATAINVOICES
		INNER JOIN
			LINESINVOICES ON JOINALLDATAINVOICES.ID = LINESINVOICES.ID
		GROUP BY
			JOINALLDATAINVOICES.ID,
			JOINALLDATAINVOICES.NombreCliente,
			JOINALLDATAINVOICES.SitioWeb,
			JOINALLDATAINVOICES.FechaFactura,
			JOINALLDATAINVOICES.MetodoEntrega;
	END
END;

GO

-- Procedimiento almacenado CLEARINVFILTER para limpiar la tabla INVOICESSTORE.
CREATE PROCEDURE CLEARINVFILTER
WITH EXECUTE AS 'dbo'
AS
BEGIN
	DELETE INST; -- Eliminar todas las facturas filtradas de INVOICESSTORE.
END;

--Estadísticas
-- Crear sinónimos para las tablas de órdenes de compra y líneas de órdenes de compra
CREATE SYNONYM PUPUR FOR [Purchasing].[PurchaseOrders]
CREATE SYNONYM PUPUROR FOR [Purchasing].[PurchaseOrderLines]

GO

-- Procedimiento almacenado para obtener toda la información de las órdenes de compra
CREATE PROCEDURE JOINALLINFORMATIONORDERS
    @Category varchar(100) = NULL,         -- Parámetro opcional para la categoría del proveedor
    @SupplierName varchar(100) = NULL       -- Parámetro opcional para el nombre del proveedor
AS
BEGIN
    SELECT
        PUSU.SupplierName AS NombreProveedor,   -- Nombre del proveedor
        PUSUCA.SupplierCategoryName AS Categoria, -- Nombre de la categoría del proveedor
        PUPUROR.ExpectedUnitPricePerOuter * PUPUROR.ReceivedOuters AS TotalLinea -- Cálculo del total de la línea
    FROM
        PUPUR                                      -- Sinónimo de PurchaseOrders
    INNER JOIN
        PUPUROR                                   -- Sinónimo de PurchaseOrderLines
    ON
        PUPUR.PurchaseOrderID = PUPUROR.PurchaseOrderID -- Relación entre órdenes y líneas de órdenes
    INNER JOIN
        PUSU                                      -- Tabla de proveedores
    ON
        PUPUR.SupplierID = PUSU.SupplierID       -- Relación entre órdenes y proveedores
    INNER JOIN
        PUSUCA                                    -- Tabla de categorías de proveedores
    ON
        PUSU.SupplierCategoryID = PUSUCA.SupplierCategoryID -- Relación entre proveedores y categorías
    WHERE
        (@Category IS NULL OR PUSUCA.SupplierCategoryName LIKE '%' + @Category + '%') -- Filtro por categoría
        AND (@SupplierName IS NULL OR PUSU.SupplierName LIKE '%' + @SupplierName + '%') -- Filtro por nombre del proveedor
END

GO

-- Procedimiento almacenado para ver estadísticas de proveedores
CREATE PROCEDURE WATCHSTATSSUPPLIERS
    @CategoryInput varchar(100) = NULL,       -- Parámetro opcional para la categoría del proveedor
    @SupplierNameInput varchar(100) = NULL     -- Parámetro opcional para el nombre del proveedor
WITH EXECUTE AS 'dbo'
AS
BEGIN
    -- Crear una tabla temporal para almacenar la información de las órdenes
    CREATE TABLE #INFORMATIONORDERS (
        NombreProveedor varchar(100), 
        Categoria varchar(100), 
        TotalLinea decimal(18, 4)
    );

    -- Insertar la información de las órdenes en la tabla temporal
    INSERT INTO #INFORMATIONORDERS (NombreProveedor, Categoria, TotalLinea)
    EXEC JOINALLINFORMATIONORDERS @Category = @CategoryInput, @SupplierName = @SupplierNameInput;

    -- Seleccionar y agrupar la información para obtener estadísticas
    SELECT
        CASE 
            WHEN GROUPING(#INFORMATIONORDERS.NombreProveedor) = 1 THEN 'Compras Promedio'
            ELSE #INFORMATIONORDERS.NombreProveedor
        END AS Proveedores,
        CASE 
            WHEN GROUPING(#INFORMATIONORDERS.Categoria) = 1 AND GROUPING(#INFORMATIONORDERS.NombreProveedor) = 1 THEN 'Compras Promedio'
            WHEN GROUPING(#INFORMATIONORDERS.Categoria) = 0 AND GROUPING(#INFORMATIONORDERS.NombreProveedor) = 0 THEN 'Maximo'
            ELSE 'Minimo'
        END AS Calculo,
        CASE 
            WHEN GROUPING(#INFORMATIONORDERS.Categoria) = 1 AND GROUPING(#INFORMATIONORDERS.NombreProveedor) = 1 THEN AVG(#INFORMATIONORDERS.TotalLinea)
            WHEN GROUPING(#INFORMATIONORDERS.Categoria) = 0 AND GROUPING(#INFORMATIONORDERS.NombreProveedor) = 0 THEN MAX(#INFORMATIONORDERS.TotalLinea)
            ELSE MIN(#INFORMATIONORDERS.TotalLinea)
        END AS Valores
    FROM
        #INFORMATIONORDERS
    GROUP BY
        ROLLUP(#INFORMATIONORDERS.NombreProveedor, #INFORMATIONORDERS.Categoria) -- Agrupamiento para el cálculo
END;

GO

-- Procedimiento almacenado para obtener toda la información de las facturas
CREATE PROCEDURE JOINALLINFORMATIONINVOICES
    @CustomerName varchar(100) = NULL,         -- Parámetro opcional para el nombre del cliente
    @CategoryName varchar(100) = NULL           -- Parámetro opcional para la categoría del cliente
AS
BEGIN
    SELECT
        CLI.CustomerName AS Nombre,               -- Nombre del cliente
        CLICAT.CustomerCategoryName AS Categoria,  -- Nombre de la categoría del cliente
        SAINLI.Quantity * SAINLI.UnitPrice AS TotalLinea -- Cálculo del total de la línea
    FROM
        CLI                                        -- Tabla de clientes
    INNER JOIN
        CLICAT                                     -- Tabla de categorías de clientes
    ON
        CLI.CustomerCategoryID = CLICAT.CustomerCategoryID -- Relación entre clientes y categorías
    INNER JOIN
        SAIN                                       -- Tabla de facturas
    ON
        CLI.CustomerID = SAIN.CustomerID          -- Relación entre clientes y facturas
    INNER JOIN
        SAINLI                                     -- Tabla de líneas de facturas
    ON
        SAIN.InvoiceID = SAINLI.InvoiceID         -- Relación entre facturas y líneas de facturas
    WHERE
        (@CustomerName IS NULL OR CLI.CustomerName LIKE '%' + @CustomerName + '%') -- Filtro por nombre del cliente
        AND (@CategoryName IS NULL OR CLICAT.CustomerCategoryName LIKE '%' + @CategoryName + '%') -- Filtro por categoría
END

GO

-- Procedimiento almacenado para ver estadísticas de clientes
CREATE PROCEDURE WATCHSTATSCUSTOMERS
    @CustomerNameInput varchar(100) = NULL,       -- Parámetro opcional para el nombre del cliente
    @CategoryNameInput varchar(100) = NULL         -- Parámetro opcional para la categoría del cliente
WITH EXECUTE AS 'dbo'
AS
BEGIN
    -- Crear una tabla temporal para almacenar la información de las facturas
    CREATE TABLE #INFORMATIONINVOICES(Nombre varchar(100), Categoria varchar(100), TotalLinea decimal(18, 4));

    -- Insertar la información de las facturas en la tabla temporal
    INSERT INTO #INFORMATIONINVOICES(Nombre, Categoria, TotalLinea)
    EXEC JOINALLINFORMATIONINVOICES @CustomerName = @CustomerNameInput, @CategoryName = @CategoryNameInput;

    -- Seleccionar y agrupar la información para obtener estadísticas
    SELECT
        CASE 
            WHEN GROUPING(#INFORMATIONINVOICES.Nombre) = 1 THEN 'Compras Promedio'
            ELSE #INFORMATIONINVOICES.Nombre
        END AS Clientes,
        CASE 
            WHEN GROUPING(#INFORMATIONINVOICES.Categoria) = 1 AND GROUPING(#INFORMATIONINVOICES.Nombre) = 1 THEN 'Compras Promedio'
            WHEN GROUPING(#INFORMATIONINVOICES.Categoria) = 0 AND GROUPING(#INFORMATIONINVOICES.Nombre) = 0 THEN 'Maximo'
            ELSE 'Minimo'
        END AS Calculo,
        CASE 
            WHEN GROUPING(#INFORMATIONINVOICES.Categoria) = 1 AND GROUPING(#INFORMATIONINVOICES.Nombre) = 1 THEN AVG(#INFORMATIONINVOICES.TotalLinea)
            WHEN GROUPING(#INFORMATIONINVOICES.Categoria) = 0 AND GROUPING(#INFORMATIONINVOICES.Nombre) = 0 THEN MAX(#INFORMATIONINVOICES.TotalLinea)
            ELSE MIN(#INFORMATIONINVOICES.TotalLinea)
        END AS Valores
    FROM
        #INFORMATIONINVOICES
    GROUP BY
        ROLLUP(#INFORMATIONINVOICES.Nombre, #INFORMATIONINVOICES.Categoria) -- Agrupamiento para el cálculo
END


CREATE LOGIN usuarioPrueba
WITH PASSWORD = 'prueba1234567';
CREATE USER prueba
FOR LOGIN usuarioPrueba;
GRANT EXECUTE ON [dbo].[FILTERCLI] TO prueba;
GRANT EXECUTE ON [dbo].[CLEARCLIFILTER] TO prueba;
GRANT EXECUTE ON [dbo].[FILTERINVOICES] TO prueba;
GRANT EXECUTE ON [dbo].[FILTERSTOCK] TO prueba;
GRANT EXECUTE ON [dbo].[FILTERSUPPLIERS] TO prueba;
GRANT EXECUTE ON [dbo].[WATCHSTATSCUSTOMERS] TO prueba;
GRANT EXECUTE ON [dbo].[WATCHSTATSSUPPLIERS] TO prueba;
GRANT EXECUTE ON [dbo].[SELECTCLI] TO prueba;
GRANT EXECUTE ON [dbo].[SELECTCUSTOMERSALES] TO prueba;
GRANT EXECUTE ON [dbo].[SELECTLINESINVOICE] TO prueba;
GRANT EXECUTE ON [dbo].[SELECTSTOCK] TO prueba;
GRANT EXECUTE ON [dbo].[SELECTSUPPLIER] TO prueba;
GRANT EXECUTE ON [dbo].[CLEARSTSTFILTER] TO prueba;
GRANT EXECUTE ON [dbo].[CLEARCUSFILTER] TO prueba;
GRANT EXECUTE ON CLEARINVFILTER TO prueba;

--Usuario de la aplicación
CREATE TABLE Usuarios(
	iduser INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
	username NVARCHAR(30) UNIQUE NOT NULL,
	passworduser NVARCHAR(30) NOT NULL,
	fullname NVARCHAR(50) NOT NULL,
	active BIT NOT NULL,
	rol NVARCHAR(30) NOT NULL,
	email NVARCHAR(30) NOT NULL,
	hiredate DATE NOT NULL,
	branch NVARCHAR(100)
);

CREATE SYNONYM US FOR Usuarios;

INSERT INTO Usuarios (username, passworduser, fullname, active, email, hiredate, rol, branch)
VALUES 
('admin01', 'password123', 'Juan Pérez', 1, 'juan.perez@empresa.com', '2022-01-15', 'Administrativo', 'San José'),
('corp01', 'secure456', 'María Gómez', 1, 'maria.gomez@empresa.com', '2021-05-20', 'Corporativo', 'Escazu'),
('admin02', 'pass789', 'Carlos López', 1, 'carlos.lopez@empresa.com', '2023-03-10', 'Administrativo', 'Limón'),
('corp02', 'mypassword', 'Ana Morales', 1, 'ana.morales@empresa.com', '2020-10-25', 'Corporativo', 'Escazu'),
('admin03', 'adminpass', 'Lucía Fernández', 1, 'lucia.fernandez@empresa.com', '2019-12-03', 'Administrativo', 'San José');

GO
ALTER PROCEDURE loginUser
	@userName NVARCHAR(30) = NULL,
	@passwordUser NVARCHAR = null
AS
BEGIN
	SELECT
		username, branch
	FROM
		Usuarios
	WHERE
		passworduser = @passwordUser;
END

--CRUD
--Insert
GO
CREATE PROCEDURE INSERTSTOCKITEM
    @StockItemName NVARCHAR(100),
    @SupplierID INT,
    @ColorID INT = NULL,
    @UnitPackageID INT,
    @OuterPackageID INT,
    @Brand NVARCHAR(50) = NULL,
    @Size NVARCHAR(20) = NULL,
    @LeadTimeDays INT,
    @QuantityPerOuter INT,
    @IsChillerStock BIT,
    @Barcode NVARCHAR(50) = NULL,
    @TaxRate DECIMAL(18, 3),
    @UnitPrice DECIMAL(18, 2),
    @RecommendedRetailPrice DECIMAL(18, 2) = NULL,
    @TypicalWeightPerUnit DECIMAL(18, 3),
    @MarketingComments NVARCHAR(MAX) = NULL,
    @InternalComments NVARCHAR(MAX) = NULL,
    @Photo VARBINARY(MAX) = NULL,
    @CustomFields NVARCHAR(MAX) = NULL,
    @LastEditedBy INT
AS
BEGIN
    INSERT INTO Warehouse.StockItems(
        StockItemName, SupplierID, ColorID, UnitPackageID, OuterPackageID,
        Brand, Size, LeadTimeDays, QuantityPerOuter, IsChillerStock,
        Barcode, TaxRate, UnitPrice, RecommendedRetailPrice, TypicalWeightPerUnit,
        MarketingComments, InternalComments, Photo, CustomFields, LastEditedBy
    ) VALUES (
        @StockItemName, @SupplierID, @ColorID, @UnitPackageID, @OuterPackageID,
        @Brand, @Size, @LeadTimeDays, @QuantityPerOuter, @IsChillerStock,
        @Barcode, @TaxRate, @UnitPrice, @RecommendedRetailPrice, @TypicalWeightPerUnit,
        @MarketingComments, @InternalComments, @Photo, @CustomFields, @LastEditedBy
    );
END;
GO

--Update
CREATE PROCEDURE UPDATESTOCKITEM
    @StockItemID INT,
    @StockItemName NVARCHAR(100),
    @SupplierID INT,
    @ColorID INT = NULL,
    @UnitPackageID INT,
    @OuterPackageID INT,
    @Brand NVARCHAR(50) = NULL,
    @Size NVARCHAR(20) = NULL,
    @LeadTimeDays INT,
    @QuantityPerOuter INT,
    @IsChillerStock BIT,
    @Barcode NVARCHAR(50) = NULL,
    @TaxRate DECIMAL(18, 3),
    @UnitPrice DECIMAL(18, 2),
    @RecommendedRetailPrice DECIMAL(18, 2) = NULL,
    @TypicalWeightPerUnit DECIMAL(18, 3),
    @MarketingComments NVARCHAR(MAX) = NULL,
    @InternalComments NVARCHAR(MAX) = NULL,
    @Photo VARBINARY(MAX) = NULL,
    @CustomFields NVARCHAR(MAX) = NULL,
    @LastEditedBy INT
AS
BEGIN
	IF EXISTS (SELECT 1 FROM Warehouse.StockItems WHERE @StockItemID = @StockItemID)
	BEGIN
		UPDATE Warehouse.StockItems
		SET
			StockItemName = @StockItemName,
			SupplierID = @SupplierID,
			ColorID = @ColorID,
			UnitPackageID = @UnitPackageID,
			OuterPackageID = @OuterPackageID,
			Brand = @Brand,
			Size = @Size,
			LeadTimeDays = @LeadTimeDays,
			QuantityPerOuter = @QuantityPerOuter,
			IsChillerStock = @IsChillerStock,
			Barcode = @Barcode,
			TaxRate = @TaxRate,
			UnitPrice = @UnitPrice,
			RecommendedRetailPrice = @RecommendedRetailPrice,
			TypicalWeightPerUnit = @TypicalWeightPerUnit,
			MarketingComments = @MarketingComments,
			InternalComments = @InternalComments,
			Photo = @Photo,
			CustomFields = @CustomFields,
			LastEditedBy = @LastEditedBy
		WHERE StockItemID = @StockItemID;
		SELECT 'Se ha modificado el producto' AS Mensaje;
	END
	ELSE
	BEGIN
		SELECT 'No se ha encontrado el producto' AS Mensaje;
	END
END;
GO

--Delete
CREATE PROCEDURE DELETESTOCKITEM
    @StockItemID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Warehouse.StockItems WHERE @StockItemID = @StockItemID)
	BEGIN
		DELETE FROM Warehouse.StockItems WHERE StockItemID = @StockItemID;
		SELECT 'El producto ha sido eliminado' AS Mensaje;
	END
	ELSE
	BEGIN
		SELECT 'El producto no existe.' AS Mensaje;
	END
END;
GO

SELECT * FROM Warehouse.StockItemHoldings;