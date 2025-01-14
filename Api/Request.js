const { sql, connectToDatabase } = require('./dbconfig');

connectToDatabase();

/**
 * @class RequestDataBase
 */
class RequestDataBase {
    constructor() {
        connectToDatabase();
    }

    async ConsultEmployees(){
        try{
            const result = await sql.query("EXEC ConsultEmployees");
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }

    async SortOrders(){
        try{
            const result = await sql.query("EXEC SortOrder");
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }

    async InsertSubCategories( categoryID, nameSubCategory){
        try{
            const result = await sql.query(`EXEC InsertProductSubCategory @ProductCategoryID = ${categoryID}, @Name = '${nameSubCategory}';`)
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }

    async InsertStore(businessEntityID, name, salesPersonID){
        try{
            const result = await sql.query(`EXEC InsertStore @BusinessEntityID = ${businessEntityID}, @Name = '${name}', @SalesPersonID = ${salesPersonID};`)
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }

    async DeletePersonAdress(adressID){
        try{
            const result = await sql.query(`EXEC DeleteAdressPerson @AdressID = ${adressID};`)
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }

    async UpdatePersonEmail(businessEntityID, emailAdress){
        try{
            const result = await sql.query(`EXEC UpdateEmailPerson @BusinessEntityID = ${businessEntityID}, @EmailAdress = '${emailAdress}';`)
            return result.recordset;
        }
        catch(err){
            console.error(err);
        }
    }
}

module.exports = { RequestDataBase };