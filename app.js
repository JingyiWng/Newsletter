const express = require("express");
const bodyParser = require("body-parser"); //To tap into the data user posted, we need body-parser
const request = require("request");
const https = require("https"); //require https standard Node module, which is available with Node.js installation. No need for a package.json file or any npm install
const { Script } = require("vm");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const config = require('./config.js');

mailchimp.setConfig({
    apiKey: config.mailchimpKey,
    server: "us21",
  });

/* 
Test mailchimp to ping endpoint
async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}
run(); 
*/

// TODO: Above, when do we need that https module


// app is a function that represents the express module, and we bind that to the word app.
const app = express();

// Since we are using static files (e.g.styles.css and images) in our local system in our HTML Script, in order for our server to serve up 
// static files, we need a special function of express. Then in HTML, need to change the path for these static files
app.use(express.static("public_static_folder"));
app.use(bodyParser.urlencoded({extended:true})); //Use this when want to parse data users post. bodyParser allows to tap into req.body, which is the parsed version of the HTTP request. 



app.get("/", function(req, res) { //When user makes a get request (i.e. wants to access home route "/"), send this html file as response
    res.sendFile(__dirname + "/sign_up.html"); 
})

app.post("/", function(req, res) { //When user makes a post request (in the HTML file, we have that form method "post") to home route (i.e."/"), send xx as response
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    // console.log(req.body);
    const listId = "1df6b513cc";

    // Add user to mailchimp list.
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName}
        });

        console.log(
          `Successfully added contact as an audience member to mailchimp. The contact's id is ${
            response.id
          }.`
        );
      }      
      run();
      

    res.send("yay"); 
})

app.listen(3000, function() {
    console.log("Server is listening now");
});



