USE WideWorldImporters;

GO
CREATE VIEW CitiesMV
WITH SCHEMABINDING
AS
	SELECT [CityID]
      ,[CityName]
      ,[StateProvinceID]
      ,[Location]
      ,[LatestRecordedPopulation]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[Cities];
CREATE UNIQUE CLUSTERED INDEX IX_CitiesMV
ON CitiesMV(CityID);

CREATE VIEW CountriesMV
WITH SCHEMABINDING
AS
	SELECT [CountryID]
      ,[CountryName]
      ,[FormalName]
      ,[IsoAlpha3Code]
      ,[IsoNumericCode]
      ,[CountryType]
      ,[LatestRecordedPopulation]
      ,[Continent]
      ,[Region]
      ,[Subregion]
      ,[Border]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[Countries]
CREATE UNIQUE CLUSTERED INDEX IX_CountriesMV
ON CountriesMV(CountryID);

CREATE VIEW DeliveryMethodsMV
WITH SCHEMABINDING
AS
	SELECT [DeliveryMethodID]
      ,[DeliveryMethodName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[DeliveryMethods]
CREATE UNIQUE CLUSTERED INDEX IX_DeliveryMethodsMV
ON DeliveryMethodsMV(DeliveryMethodID);

CREATE VIEW PaymentsMethodsMV
WITH SCHEMABINDING
AS
	SELECT [PaymentMethodID]
      ,[PaymentMethodName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[PaymentMethods]
CREATE UNIQUE CLUSTERED INDEX IX_PaymentsMethodsMV
ON PaymentsMethodsMV(PaymentMethodID);

CREATE VIEW PeopleMV
WITH SCHEMABINDING
AS
	SELECT [PersonID]
      ,[FullName]
      ,[PreferredName]
      ,[SearchName]
      ,[IsPermittedToLogon]
      ,[LogonName]
      ,[IsExternalLogonProvider]
      ,[HashedPassword]
      ,[IsSystemUser]
      ,[IsEmployee]
      ,[IsSalesperson]
      ,[UserPreferences]
      ,[PhoneNumber]
      ,[FaxNumber]
      ,[EmailAddress]
      ,[Photo]
      ,[CustomFields]
      ,[OtherLanguages]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[People]
CREATE UNIQUE CLUSTERED INDEX IX_PeopleMV
ON PeopleMV(PersonID);

CREATE VIEW StateProvincesMV
WITH SCHEMABINDING
AS
	SELECT [StateProvinceID]
      ,[StateProvinceCode]
      ,[StateProvinceName]
      ,[CountryID]
      ,[SalesTerritory]
      ,[Border]
      ,[LatestRecordedPopulation]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[StateProvinces]
CREATE UNIQUE CLUSTERED INDEX IX_StateProvincesMV
ON StateProvincesMV(StateProvinceID);

CREATE VIEW TransactionTypesMV
WITH SCHEMABINDING
AS
	SELECT [TransactionTypeID]
      ,[TransactionTypeName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Application].[TransactionTypes]
CREATE UNIQUE CLUSTERED INDEX IX_TransactionTypesMV
ON TransactionTypesMV(TransactionTypeID);

CREATE VIEW SupplierCategoriesMV
WITH SCHEMABINDING
AS
	SELECT [SupplierCategoryID]
      ,[SupplierCategoryName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Purchasing].[SupplierCategories]
CREATE UNIQUE CLUSTERED INDEX IX_SupplierCategoriesMV
ON SupplierCategoriesMV(SupplierCategoryID);

CREATE VIEW SupplierMV
WITH SCHEMABINDING
AS
	SELECT [SupplierID]
      ,[SupplierName]
      ,[SupplierCategoryID]
      ,[PrimaryContactPersonID]
      ,[AlternateContactPersonID]
      ,[DeliveryMethodID]
      ,[DeliveryCityID]
      ,[PostalCityID]
      ,[SupplierReference]
      ,[BankAccountName]
      ,[BankAccountBranch]
      ,[BankAccountCode]
      ,[BankAccountNumber]
      ,[BankInternationalCode]
      ,[PaymentDays]
      ,[InternalComments]
      ,[PhoneNumber]
      ,[FaxNumber]
      ,[WebsiteURL]
      ,[DeliveryAddressLine1]
      ,[DeliveryAddressLine2]
      ,[DeliveryPostalCode]
      ,[DeliveryLocation]
      ,[PostalAddressLine1]
      ,[PostalAddressLine2]
      ,[PostalPostalCode]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Purchasing].[Suppliers]
CREATE UNIQUE CLUSTERED INDEX IX_SupplierMV
ON SupplierMV(SupplierID);

CREATE VIEW BuyingGroupsMV
WITH SCHEMABINDING
AS
	SELECT [BuyingGroupID]
      ,[BuyingGroupName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Sales].[BuyingGroups]
CREATE UNIQUE CLUSTERED INDEX IX_BuyingGroupsMV
ON BuyingGroupsMV(BuyingGroupID);

CREATE VIEW CustomerCategoriesMV
WITH SCHEMABINDING
AS
	SELECT [CustomerCategoryID]
      ,[CustomerCategoryName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Sales].[CustomerCategories]
CREATE UNIQUE CLUSTERED INDEX IX_CustomerCategoriesMV
ON CustomerCategoriesMV(CustomerCategoryID);

CREATE VIEW CustomersMV
WITH SCHEMABINDING
AS
	SELECT [CustomerID]
      ,[CustomerName]
      ,[BillToCustomerID]
      ,[CustomerCategoryID]
      ,[BuyingGroupID]
      ,[PrimaryContactPersonID]
      ,[AlternateContactPersonID]
      ,[DeliveryMethodID]
      ,[DeliveryCityID]
      ,[PostalCityID]
      ,[CreditLimit]
      ,[AccountOpenedDate]
      ,[StandardDiscountPercentage]
      ,[IsStatementSent]
      ,[IsOnCreditHold]
      ,[PaymentDays]
      ,[PhoneNumber]
      ,[FaxNumber]
      ,[DeliveryRun]
      ,[RunPosition]
      ,[WebsiteURL]
      ,[DeliveryAddressLine1]
      ,[DeliveryAddressLine2]
      ,[DeliveryPostalCode]
      ,[DeliveryLocation]
      ,[PostalAddressLine1]
      ,[PostalAddressLine2]
      ,[PostalPostalCode]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Sales].[Customers]
-- Desactivar temporalmente la política de seguridad
ALTER SECURITY POLICY FilterCustomersBySalesTerritoryRole
WITH (STATE = OFF);
-- Crear el índice en la vista
CREATE UNIQUE CLUSTERED INDEX IX_CustomersMV
ON CustomersMV(CustomerID);
-- Reactivar la política de seguridad
ALTER SECURITY POLICY FilterCustomersBySalesTerritoryRole
WITH (STATE = ON);

CREATE VIEW ColdRoomTemperaturesMV
WITH SCHEMABINDING
AS
	SELECT [ColdRoomTemperatureID]
      ,[ColdRoomSensorNumber]
      ,[RecordedWhen]
      ,[Temperature]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Warehouse].[ColdRoomTemperatures]
CREATE UNIQUE CLUSTERED INDEX IX_ColdRoomTemperaturesMV
ON ColdRoomTemperaturesMV(ColdRoomTemperatureID);

CREATE VIEW ColorsMV
WITH SCHEMABINDING
AS
	SELECT [ColorID]
      ,[ColorName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Warehouse].[Colors]
CREATE UNIQUE CLUSTERED INDEX IX_ColorsMV
ON ColorsMV(ColorID);

CREATE VIEW PackageTypesMV
WITH SCHEMABINDING
AS
	SELECT [PackageTypeID]
      ,[PackageTypeName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Warehouse].[PackageTypes]
CREATE UNIQUE CLUSTERED INDEX IX_PackageTypesMV
ON PackageTypesMV(PackageTypeID);

CREATE VIEW StockGroupsMV
WITH SCHEMABINDING
AS
	SELECT [StockGroupID]
      ,[StockGroupName]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Warehouse].[StockGroups]
CREATE UNIQUE CLUSTERED INDEX IX_StockGroupsMV
ON StockGroupsMV(StockGroupID);

CREATE VIEW StockItemsMV
WITH SCHEMABINDING
AS
	SELECT [StockItemID]
      ,[StockItemName]
      ,[SupplierID]
      ,[ColorID]
      ,[UnitPackageID]
      ,[OuterPackageID]
      ,[Brand]
      ,[Size]
      ,[LeadTimeDays]
      ,[QuantityPerOuter]
      ,[IsChillerStock]
      ,[Barcode]
      ,[TaxRate]
      ,[UnitPrice]
      ,[RecommendedRetailPrice]
      ,[TypicalWeightPerUnit]
      ,[MarketingComments]
      ,[InternalComments]
      ,[Photo]
      ,[CustomFields]
      ,[Tags]
      ,[SearchDetails]
      ,[LastEditedBy]
      ,[ValidFrom]
      ,[ValidTo]
  FROM [Warehouse].[StockItems]
CREATE UNIQUE CLUSTERED INDEX IX_StockItemsMV
ON StockItemsMV(StockItemID);

--Estadísticas
--Montos Compras por Proveedores

CREATE VIEW MontosComprasProveedoresMV
WITH SCHEMABINDING
AS
	SELECT
        SupplierName AS NombreProveedor,
        SupplierCategoryName AS Categoria,
        ExpectedUnitPricePerOuter * PurchaseOrderLines.ReceivedOuters AS TotalLinea
    FROM
        [Purchasing].[PurchaseOrders]
    INNER JOIN
        [Purchasing].[PurchaseOrderLines]
    ON
        PurchaseOrders.PurchaseOrderID = PurchaseOrderLines.PurchaseOrderID
    INNER JOIN
        [Purchasing].[Suppliers]
    ON
        PurchaseOrders.SupplierID = Suppliers.SupplierID
    INNER JOIN
        [Purchasing].[SupplierCategories]
    ON
        Suppliers.SupplierCategoryID = SupplierCategories.SupplierCategoryID
CREATE UNIQUE CLUSTERED INDEX IX_MontosComprasProveedoresMV
ON MontosComprasProveedoresMV(NombreProveedor);

CREATE TABLE CustomersSummary(
	[CustomerID] [int] NOT NULL PRIMARY KEY,
	[CustomerName] [nvarchar](100) NOT NULL,
	[BillToCustomerID] [int] NOT NULL,
	[CustomerCategoryID] [int] NOT NULL,
	[BuyingGroupID] [int] NULL,
	[PrimaryContactPersonID] [int] NOT NULL,
	[AlternateContactPersonID] [int] NULL,
	[DeliveryMethodID] [int] NOT NULL,
	[DeliveryCityID] [int] NOT NULL,
	[PostalCityID] [int] NOT NULL,
	[CreditLimit] [decimal](18, 2) NULL,
	[AccountOpenedDate] [date] NOT NULL,
	[StandardDiscountPercentage] [decimal](18, 3) NOT NULL,
	[IsStatementSent] [bit] NOT NULL,
	[IsOnCreditHold] [bit] NOT NULL,
	[PaymentDays] [int] NOT NULL,
	[PhoneNumber] [nvarchar](20) NOT NULL,
	[FaxNumber] [nvarchar](20) NOT NULL,
	[DeliveryRun] [nvarchar](5) NULL,
	[RunPosition] [nvarchar](5) NULL,
	[WebsiteURL] [nvarchar](256) NOT NULL,
	[DeliveryAddressLine1] [nvarchar](60) NOT NULL,
	[DeliveryAddressLine2] [nvarchar](60) NULL,
	[DeliveryPostalCode] [nvarchar](10) NOT NULL,
	[DeliveryLocation] [geography] NULL,
	[PostalAddressLine1] [nvarchar](60) NOT NULL,
	[PostalAddressLine2] [nvarchar](60) NULL,
	[PostalPostalCode] [nvarchar](10) NOT NULL,
	[LastEditedBy] [int] NOT NULL,
	[ValidFrom] [datetime2](7),
	[ValidTo] [datetime2](7)
);

INSERT INTO CustomersSummary (
    CustomerID,
    CustomerName,
    BillToCustomerID,
    CustomerCategoryID,
    BuyingGroupID,
    PrimaryContactPersonID,
    AlternateContactPersonID,
    DeliveryMethodID,
    DeliveryCityID,
    PostalCityID,
    CreditLimit,
    AccountOpenedDate,
    StandardDiscountPercentage,
    IsStatementSent,
    IsOnCreditHold,
    PaymentDays,
    PhoneNumber,
    FaxNumber,
    DeliveryRun,
    RunPosition,
    WebsiteURL,
    DeliveryAddressLine1,
    DeliveryAddressLine2,
    DeliveryPostalCode,
    DeliveryLocation,
    PostalAddressLine1,
    PostalAddressLine2,
    PostalPostalCode,
    LastEditedBy,
    ValidFrom,
    ValidTo
)
SELECT 
    CustomerID,
    CustomerName,
    BillToCustomerID,
    CustomerCategoryID,
    BuyingGroupID,
    PrimaryContactPersonID,
    AlternateContactPersonID,
    DeliveryMethodID,
    DeliveryCityID,
    PostalCityID,
    CreditLimit,
    AccountOpenedDate,
    StandardDiscountPercentage,
    IsStatementSent,
    IsOnCreditHold,
    PaymentDays,
    PhoneNumber,
    FaxNumber,
    DeliveryRun,
    RunPosition,
    WebsiteURL,
    DeliveryAddressLine1,
    DeliveryAddressLine2,
    DeliveryPostalCode,
    DeliveryLocation,
    PostalAddressLine1,
    PostalAddressLine2,
    PostalPostalCode,
    LastEditedBy,
    ValidFrom,
    ValidTo
FROM Sales.Customers;


CREATE VIEW MontosVentasClientesMV
WITH SCHEMABINDING
AS
	SELECT
        CustomersSummary.CustomerName AS Nombre,
        CustomerCategories.CustomerCategoryName AS Categoria,
        InvoiceLines.Quantity * InvoiceLines.UnitPrice AS TotalLinea
    FROM
        [dbo].[CustomersSummary]
    INNER JOIN
        [Sales].[CustomerCategories]
    ON
        CustomersSummary.CustomerCategoryID = CustomerCategories.CustomerCategoryID
    INNER JOIN
        [Sales].[Invoices]
    ON
        CustomersSummary.CustomerID = Invoices.CustomerID
    INNER JOIN
        [Sales].[InvoiceLines]
    ON
        Invoices.InvoiceID = InvoiceLines.InvoiceID 
CREATE UNIQUE CLUSTERED INDEX IX_MontosVentasClientesMV
ON MontosVentasClientesMV(Nombre);

CREATE VIEW Top5ProductosMejoresGananciasMV
WITH SCHEMABINDING
AS
	SELECT
		Invoices.InvoiceID,
		InvoiceDate,
		StockItemName,
		InvoiceLines.UnitPrice * Quantity AS Total
	FROM
		[Sales].[Invoices]
	INNER JOIN
		[Sales].[InvoiceLines]
	ON
		Invoices.InvoiceID = InvoiceLines.InvoiceID
	INNER JOIN
		[Warehouse].[StockItems]
	ON
		StockItems.StockItemID = InvoiceLines.StockItemID;
CREATE UNIQUE CLUSTERED INDEX IX_Top5ProductosMejoresGananciasMV
ON Top5ProductosMejoresGananciasMV(InvoiceID, StockItemName);

CREATE VIEW Top5ClientesConMasFacturasMV
WITH SCHEMABINDING
AS
	SELECT
		Invoices.InvoiceID,
		InvoiceDate,
		CustomersSummary.CustomerID,
		CustomerName,
		InvoiceLines.UnitPrice * Quantity AS Total
	FROM
		[dbo].[CustomersSummary]
	INNER JOIN
		[Sales].[Invoices]
	ON
		CustomersSummary.CustomerID = Invoices.CustomerID
	INNER JOIN
		[Sales].[InvoiceLines]
	ON
		InvoiceLines.InvoiceID = Invoices.InvoiceID;
CREATE UNIQUE CLUSTERED INDEX IX_Top5ClientesConMasFacturasMV
ON Top5ClientesConMasFacturasMV(InvoiceID, CustomerID);

CREATE VIEW Top5ProveedoresConMasOrdenesMV
WITH SCHEMABINDING
AS
	SELECT
		Suppliers.SupplierID,
		SupplierName,
		PurchaseOrders.PurchaseOrderID,
		PurchaseOrders.OrderDate,
		PurchaseOrderLines.ReceivedOuters * PurchaseOrderLines.ExpectedUnitPricePerOuter AS Total
	FROM
		[Purchasing].[Suppliers]
	INNER JOIN
		[Purchasing].[PurchaseOrders]
	ON
		Suppliers.SupplierID = PurchaseOrders.SupplierID
	INNER JOIN
		[Purchasing].[PurchaseOrderLines]
	ON
		PurchaseOrders.PurchaseOrderID = PurchaseOrderLines.PurchaseOrderID;
CREATE UNIQUE CLUSTERED INDEX IX_Top5ProveedoresConMasOrdenesMV
ON Top5ProveedoresConMasOrdenesMV(SupplierID, PurchaseOrderID);

SELECT * FROM [Purchasing].[PurchaseOrders]
SELECT * FROM [Purchasing].[PurchaseOrderLines]