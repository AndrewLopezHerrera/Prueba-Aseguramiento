'use client';

import { useState } from 'react';
import styles from './actualizar.module.css';

// Lista completa de Suppliers
const suppliers = [
  { id: 1, name: 'A Datum Corporation' },
  { id: 2, name: 'Contoso, Ltd.' },
  { id: 3, name: 'Consolidated Messenger' },
  { id: 4, name: 'Fabrikam, Inc.' },
  { id: 5, name: 'Graphic Design Institute' },
  { id: 6, name: 'Humongous Insurance' },
  { id: 7, name: 'Litware, Inc.' },
  { id: 8, name: 'Lucerne Publishing' },
  { id: 9, name: 'Nod Publishers' },
  { id: 10, name: 'Northwind Electric Cars' },
  { id: 11, name: 'Trey Research' },
  { id: 12, name: 'The Phone Company' },
  { id: 13, name: 'Woodgrove Bank' },
];

// Lista completa de Colores
const colors = [
  { id: 1, name: 'Azure' },
  { id: 2, name: 'Beige' },
  { id: 3, name: 'Black' },
  { id: 4, name: 'Blue' },
  { id: 5, name: 'Charcoal' },
  { id: 6, name: 'Chartreuse' },
  { id: 7, name: 'Cyan' },
  { id: 8, name: 'Dark Brown' },
  { id: 9, name: 'Dark Green' },
  { id: 10, name: 'Fuchsia' },
  { id: 11, name: 'Gold' },
  { id: 12, name: 'Steel Gray' },
  { id: 13, name: 'Hot Pink' },
  { id: 14, name: 'Indigo' },
  { id: 15, name: 'Ivory' },
  { id: 16, name: 'Khaki' },
  { id: 17, name: 'Lavender' },
  { id: 18, name: 'Light Brown' },
  { id: 19, name: 'Light Green' },
  { id: 20, name: 'Maroon' },
  { id: 21, name: 'Mauve' },
  { id: 22, name: 'Navy Blue' },
  { id: 23, name: 'Olive' },
  { id: 24, name: 'Orange' },
  { id: 25, name: 'Plum' },
  { id: 26, name: 'Puce' },
  { id: 27, name: 'Purple' },
  { id: 28, name: 'Red' },
  { id: 29, name: 'Royal Blue' },
  { id: 30, name: 'Salmon' },
  { id: 31, name: 'Silver' },
  { id: 32, name: 'Tan' },
  { id: 33, name: 'Teal' },
  { id: 34, name: 'Wheat' },
  { id: 35, name: 'White' },
  { id: 36, name: 'Yellow' },
];

// Lista completa de Paquetes
const packages = [
  { id: 1, name: 'Bag' },
  { id: 2, name: 'Block' },
  { id: 3, name: 'Bottle' },
  { id: 4, name: 'Box' },
  { id: 5, name: 'Can' },
  { id: 6, name: 'Carton' },
  { id: 7, name: 'Each' },
  { id: 8, name: 'Kg' },
  { id: 9, name: 'Packet' },
  { id: 10, name: 'Pair' },
  { id: 11, name: 'Pallet' },
  { id: 12, name: 'Tray' },
  { id: 13, name: 'Tub' },
  { id: 14, name: 'Tube' },
];

const Insertar = () => {
  const [formData, setFormData] = useState({
    StockItemID: '',
    StockItemName: '',
    SupplierID: '',
    ColorID: '',
    UnitPackageID: '',
    OuterPackageID: '',
    Brand: '',
    Size: '',
    LeadTimeDays: '',
    QuantityPerOuter: '',
    IsChillerStock: false,
    Barcode: '',
    TaxRate: '',
    UnitPrice: '',
    RecommendedRetailPrice: '',
    TypicalWeightPerUnit: '',
    MarketingComments: '',
    InternalComments: '',
    Photo: null, // Cambiar a null para el archivo
    CustomFields: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : files ? files[0] : value, // Manejar archivo
    });
  };

  const insertarProducto = async (e) => {
    e.preventDefault();
    const data = new FormData(); // Crear un FormData para la subida de archivos

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://localhost:4000/ActualizarProducto', {
        method: 'POST',
        body: data, // Enviar FormData en lugar de JSON
      });

      const responseData = await res.json();

      if (responseData.success) {
        setMensaje('Producto insertado con éxito.');
        setFormData({
          StockItemID: '',
          StockItemName: '',
          SupplierID: '',
          ColorID: '',
          UnitPackageID: '',
          OuterPackageID: '',
          Brand: '',
          Size: '',
          LeadTimeDays: '',
          QuantityPerOuter: '',
          IsChillerStock: false,
          Barcode: '',
          TaxRate: '',
          UnitPrice: '',
          RecommendedRetailPrice: '',
          TypicalWeightPerUnit: '',
          MarketingComments: '',
          InternalComments: '',
          Photo: null, // Reiniciar a null después de enviar
          CustomFields: '',
        });
      } else {
        setMensaje('Error al insertar el producto.');
      }
    } catch (error) {
      console.error('Error al insertar el producto:', error);
      setMensaje('Error en la comunicación con el servidor.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Actualizar Producto</h2>
      <form onSubmit={insertarProducto} className={styles.form}>
        {/* Supplier combobox */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Stock Item ID</label>
          <input
            type="number"
            name="StockItemID"
            value={formData.StockItemName}
            onChange={handleChange}
            className={styles.textInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Stock Item Name</label>
          <input
            type="text"
            name="StockItemName"
            value={formData.StockItemName}
            onChange={handleChange}
            className={styles.textInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Supplier</label>
          <select
            name="SupplierID"
            value={formData.SupplierID}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color combobox */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Color</label>
          <select
            name="ColorID"
            value={formData.ColorID}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccione un color</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Package combobox */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Unit Package</label>
          <select
            name="UnitPackageID"
            value={formData.UnitPackageID}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccione un paquete</option>
            {packages.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
        </div>

        {/* Outer Package combobox */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Outer Package</label>
          <select
            name="OuterPackageID"
            value={formData.OuterPackageID}
            onChange={handleChange}
            className={styles.selectInput}
            required
          >
            <option value="">Seleccione un paquete exterior</option>
            {packages.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
        </div>

        {/* Foto */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Foto del producto</label>
          <input
            type="file"
            name="Photo"
            accept="image/*"
            onChange={handleChange}
            className={styles.fileInput}
            required
          />
        </div>

        {/* Resto de campos de texto */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Brand</label>
          <input
            type="text"
            name="Brand"
            value={formData.Brand}
            onChange={handleChange}
            className={styles.textInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Size</label>
          <input
            type="text"
            name="Size"
            value={formData.Size}
            onChange={handleChange}
            className={styles.textInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Lead Time Days</label>
          <input
            type="number"
            name="LeadTimeDays"
            value={formData.LeadTimeDays}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Quantity Per Outer</label>
          <input
            type="number"
            name="QuantityPerOuter"
            value={formData.QuantityPerOuter}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Is Chiller Stock</label>
          <input
            type="checkbox"
            name="IsChillerStock"
            checked={formData.IsChillerStock}
            onChange={handleChange}
            className={styles.checkboxInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Barcode</label>
          <input
            type="text"
            name="Barcode"
            value={formData.Barcode}
            onChange={handleChange}
            className={styles.textInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tax Rate</label>
          <input
            type="number"
            name="TaxRate"
            value={formData.TaxRate}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Unit Price</label>
          <input
            type="number"
            name="UnitPrice"
            value={formData.UnitPrice}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Recommended Retail Price</label>
          <input
            type="number"
            name="RecommendedRetailPrice"
            value={formData.RecommendedRetailPrice}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Typical Weight Per Unit</label>
          <input
            type="number"
            name="TypicalWeightPerUnit"
            value={formData.TypicalWeightPerUnit}
            onChange={handleChange}
            className={styles.numberInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Marketing Comments</label>
          <textarea
            name="MarketingComments"
            value={formData.MarketingComments}
            onChange={handleChange}
            className={styles.textareaInput}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Internal Comments</label>
          <textarea
            name="InternalComments"
            value={formData.InternalComments}
            onChange={handleChange}
            className={styles.textareaInput}
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Custom Fields</label>
          <input
            type="text"
            name="CustomFields"
            value={formData.CustomFields}
            onChange={handleChange}
            className={styles.textInput}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Insertar Producto</button>
      </form>
      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default Insertar;
