const { pool } = require("../database/db")


const CreateGrocery = async (req, res) => {

    try {
        const { name, price, stock } = req.body;
        if (!name || !price || !stock) {
            throw new Error('Name, price, and stock are required !');
        }
        if (parseInt(stock) < 0)
            throw new Error('Invalid value for Stock !');

        await pool.query("begin")
        const query = `insert into grocery(name,price,stock) values($1,$2,$3) returning *`
        const insertedRows = await pool.query(query, [name, price, stock])
        if (insertedRows.rowCount < 1)
            throw new Error("Unable execute insert command !")
        await pool.query("commit")
        res.status(201).send({
            status: "ok",
            msg: "created grocery",
            id: insertedRows.rows[0].item_id
        })

    } catch (err) {
        await pool.query("commit")
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}


const GetGroceryById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "Select * from grocery where item_id=$1"
        const rows = await pool.query(query, [id])
        if (rows.rowCount < 1)
            throw new Error("No grocery found !")

        res.status(200).send({
            status: "ok",
            msg: "Got the grocery",
            data: rows.rows[0]
        })


    } catch (err) {
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}


const GetAllGroceries = async (req,res) => {
    try {
        const query = "Select * from grocery"
        const rows = await pool.query(query, [])
        res.status(200).send({
            status: "ok",
            msg: "got the details",
            data: rows.rows
        })

    } catch (err) {
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }

}

const UpdateGrocery = async (req, res) => {
    try {

        const id = req.params.id;
        const { name, price, stock } = req.body;
        const fieldsToUpdate = [];
        const valuesToUpdate = [];
        let placeholderIndex = 1;

        if (parseInt(stock) < 0)
            throw new Error("Item stock cannot be negative !")

        if (parseFloat(price) < 0)
            throw new Error("Item price cannot be negative !")

        if (name) {
            fieldsToUpdate.push(`name = $${placeholderIndex}`);
            valuesToUpdate.push(name);
            placeholderIndex++;
        }
        if (price) {
            fieldsToUpdate.push(`price = $${placeholderIndex}`);
            valuesToUpdate.push(price);
            placeholderIndex++;
        }
        if (stock) {
            fieldsToUpdate.push(`stock = $${placeholderIndex}`);
            valuesToUpdate.push(stock);
            placeholderIndex++;
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }
        await pool.query("begin")
        const updateQuery = `UPDATE grocery SET ${fieldsToUpdate.join(', ')} WHERE item_id = $${placeholderIndex} RETURNING *`;
        const updateValues = [...valuesToUpdate, id];

        const result = await pool.query(updateQuery, updateValues);

        if (result.rowCount === 0) {
            throw new Error("Grocery not found")
        }
        await pool.query("commit")
        res.status(200).send({
            status: "ok",
            msg: "updated the details",
            data: result.rows[0]
        })


    } catch (err) {
        await pool.query("rollback")
        res.status(400).send({
            msg: err.message,
            status: "failed"
        })
    }
}

const DeleteGrocery = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            throw new Error("Invalid request !")
        await pool.query("begin")

        const query = "delete from grocery where item_id=$1 returning *"
        const rows = await pool.query(query, [id])
        if (rows.rowCount < 1)
            throw new Error("No item found !")

        await pool.query("commit")

        res.status(200).send({
            status: "ok",
            msg: "deleted the grocery"
        })

    } catch (err) {
        await pool.query("rollback")
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}

module.exports = {
    CreateGrocery,
    GetGroceryById,
    GetAllGroceries,
    UpdateGrocery,
    DeleteGrocery
}