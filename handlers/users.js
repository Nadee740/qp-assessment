const { pool } = require("../database/db")


const GetAvailableItems = async (req, res) => {
    try {

        const query = "select * from grocery where stock>0"
        const rows = await pool.query(query, [])
        res.status(200).send({
            status: "ok",
            msg: "got available items",
            data: rows.rows
        })

    } catch (err) {
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}


const PurchaseItems = async (req, res) => {
    try {
        const { user_id, data } = req.body;
        await pool.query("begin")
        for (const item of data) {
            const item_id = item.item_id;
            const quantity = item.quantity;

            const stockAvailable = await pool.query("Select *,stock>=$2 as available from grocery where item_id=$1", [item_id,quantity])
            if (stockAvailable.rowCount < 1 || !stockAvailable.rows[0].available)
                throw new Error(`No stock available for the item with item ID: ${item_id} !`)
            let query = "insert into purchases(user_id) values($1) returning *"
            const rows = await pool.query(query, [user_id])
            if (rows.rowCount < 1)
                throw new Error("Failed to Purchase !")

            const purchase_id = rows.rows[0].purchase_id;
            query = "insert into purchase_details values($1,$2,$3) returning *"
            const details = await pool.query(query, [purchase_id, item_id, quantity])
            if (details.rowCount < 1)
                throw new Error("Failed to Purchase !")

            query = "update grocery set stock=stock-$1 where item_id=$2 returning *"
            const itemStock = await pool.query(query, [quantity, item_id])
            if (itemStock.rowCount < 1)
                throw new Error("Failed to Purchase !")

        }
        await pool.query("commit")
        res.status(200).send({
            status: "ok",
            msg: "Item purchase success "
        })

    } catch (err) {
        await pool.query("rollback")
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}

const PurchaseHistory = async (req, res) => {
    try {

        const user_id = req.query.user_id;

        const query = "select * from purchases p,purchase_details pd,users u where u.user_id=$1 and u.user_id=p.user_id and p.purchase_id=pd.purchase_id"
        const details = await pool.query(query, [user_id])
        res.status(200).send({
            status: "ok",
            msg: "got the purchase history",
            data: details.rows
        })

    } catch (err) {
        res.status(400).send({
            status: "failed",
            msg: err.message
        })
    }
}

module.exports = {
    GetAvailableItems,
    PurchaseItems,
    PurchaseHistory
}