const express = require("express");
const { Client } = require("@notionhq/client");
const cors = require("cors");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const PORT = 3001;
const HOST = "localhost";

const notion = new Client({ auth: "secret_vRUL38XE3sYGu6kMqwgybbJLHUnnCn4rObhz3yqUl6m"});

const databaseID = "ddecd015a4324086851345f4161af6fa";

//GET request
// GET Question, Answer, and Tags from the Db
//Functionality: create an accordian style drop down list for the FAQ

app.get('/', async (req, res) => {
    try{
        //nake the Notion API request to getch data from the database
       const response = await notion.databases.query({database_id: databaseID})

       //extract necessary data from the response
       const data = response.results;

       //filter data for the correct columns

       const includedColumns = ['Question','Answer','Tags'];

       const filteredData = data.map((item) =>{
        const filteredItem = {};
        for (const column of includedColumns) {
            filteredItem[column] = item.properties[column];
        }

        return filteredItem;
       })

       //send the data as a response
       res.json(filteredData);

    } catch(error){
        console.error('Error retreiving data from notion',error)
        res.status(500).json({error: 'Failed to retrieve data from Notion'});
    }

})

app.listen(PORT, HOST, ()=>{
    console.log("Starting Proxy at " + HOST + ":" + PORT);
})