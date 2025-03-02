#  API To-Do List

## ขั้นตอนในการติดตั้ง
    git clone https://github.com/jame191036/to-do.git


## วิธีการใช้งาน
ท่านจะต้องติดตั้ง node.js ในเครื่องก่อน

จะมี Database เอาไว้ใช้ Import อยู่ที่ folder DatabasePorject/todo_db.sql ซึ่งจะเป็น Database ของ MySQL 

เมื่อท่านได้ Import Database เรียบร้อยแล้วสามารถสามารถเปลี่ยน confing ให้ตรงกับ Database ที่ท่านติดตั้งได้ที่ Confing/db.js
หลังจากนั้นให้ท่าน run Terminal ด้วยคำสั่ง 

    node server.js

เมื่อ run สำเร็จแล้วสามารถ Import API Documents ที่เป็น Postman ได้ที่ folder APIDocuments/ToDoList.postman_collection.json
