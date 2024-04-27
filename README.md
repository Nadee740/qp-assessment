This the backend server for the grocery running on port 8080


There is mainly 4 tables for this server
 1. user table (user_id)
 2. grocery(item_id,name,price,stock)
 3. purchases(purchase_id,user_id,created_at)
 4. purchase_details(purchase_id,item_id,quantity)


There are two user groups 
1. Admin
2. User


The routes for Admin

POST -- "/api/v1/admin/create-grocery" For creating a grocery item

GET  : "/api/v1/admin/grocery/:id"   For get a particular grocery item

GET : "/api/v1/admin/groceries       for Getting all Groceries

PATCH : "/api/v1/admin/grocery/:id"   update a grocery

DELETE :  "/api/v1/admin/grocery/:id"  delete a grocery


The routes for Users

GET   :  "/api/v1/user/items" :   Get all available items to purchase

POST  :  "/api/v1/user/purchase-items" : Make purchases 

GET  :  '/api/v1/user/purchase-history'  : GET purchase history
