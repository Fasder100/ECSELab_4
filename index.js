const express = require("express");
const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

const app = express();
app.use(express.json());

const datab = new Sequelize("postgres://lxwvdcko:qY7tR5z77JSJhZDILGzl4URM88hWz4aW@ziggy.db.elephantsql.com:5432/lxwvdcko");

datab.authenticate()
.then(() => console.log("Connection was successful."))
.catch ( err => console.error(err));



DB = [
    {
    id : 1,
    usernname : "jmjager",
    color : "black",
    role: "supervisor",
    }
];

const tankdb = datab.define("tankdb",{

        location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lat: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        long: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        percentage_full: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false
    },
    
    
    );



app.get("/data", (req,res)=>{
    tankdb.findAll().then(
        (tanks) => {
            res.json(tanks);
        }
    ).catch(
        (err) => {
            res.status(400).json("Something went wrong");
            console.error(err);
        });

});

app.post("/data", (req,res) => {

    tankdb.create(
        {location: req.body.location,
            lat: req.body.lat,
            long: req.body.long,
            percentage_full: req.body.percentage_full,
        }
    ).then((tank)=>{
    res.json(tank);
    
    }).catch(
        (err) => {
            res.status(400).json("Could not create tank");
            console.error(err);
        }
    );


});
app.patch("/data/:id", (req, res) => {

 let id = req.params.id;
 let update = req.body;

 tankdb.update(update, {
     where: {
         id :id
     },
     returning: true,
 })
 .then((tank) => {
     res.json(tank);
 })
 .catch((err) =>{
     res.status(400).json("Couldn't update item");
     console.error(err);
 });

});

app.delete("/data/:id", (req,res) => {

    let id = req.params.id;
   tankdb.destroy({
       where:{
           id :id,
       }
   }).then((num) => {
       if (num ==1){

        res.json({
            success: true,
        }
        );}
    }).catch((err) => {
        res.status(400).json("COuldn't delet object");
        console.error(err);
    });
      
});

//PROFILE
app.get("/profile", function (request, response){
    response.json(DB);
});
app.get("/profile/:id", function(request,response){

    DB.array.forEach( (i) => {
        
        if (i["id"] == request.params.id){
            var output = request.body;
        }
       
        
    });
    response.json(output); 

});

app.post("/profile", function(request,response){
const profile = {
    id: DB.length +1,
    username : request.body.username,
    color: request.body.color,
    role: request.body.role,
    last_updated: Date.now().toString(),
};
DB.push (profile);
response.json(profile);

});

app.patch("/profile/:id", function(req,res){

    DB.forEach( (i) => {
        
        if (i["id"] == req.params.id){
            i["username"] = req.body.username;
            i["color"] = req.body.color;
            i["role"] = req.body.role;
            i["last_updated"] = Date.now().toString();
        }
        res.json(req.body);
        
    });

});

app.listen(3000);
