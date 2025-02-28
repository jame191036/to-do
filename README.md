#  API To-Do List

## ขั้นตอนในการติดตั้ง
    git clone https://github.com/jame191036/to-do.git


## วิธีการใช้งาน
ท่านจะต้องติดตั้ง node.js ในเครื่องก่อน
จะมี dataBase ให้ อยู่ที่ folder DatabasePorject/todo_db.sql ซึ่งจะเป็น MySQL เอาไว้ใช้ Import

เมือท่านได้ Import dataBase เรียบร้อยแล้วสามารถสามารถเปลี่ยน confing ให้ตรงกับที่ dataBase ได้ที่ Confing/db.js
หลังจากนั้นให้ท่าน run Terminal ด้วยคำสั่ง 

    npx nodemon server.js

เมื่อ run สำเร็จแล้วสามารถ Import API Documents ที่เป็น Postman ได้ที่ folder APIDocuments/ToDoList.postman_collection.json
