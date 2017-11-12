var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();

app.use(OnSetHeader);
app.use(bodyParser.json());
    
app.get('/listUsers', ListUsers);
app.get('/listUser/:id', ListUserById);
app.post('/addUser', AddUser);
app.delete('/deleteUser/:id', DeleteUser);
app.get('/listTraces', ListTraces);
app.delete('/deleteTrace/:id', DeleteTrace);

var server = app.listen(8081, OnInitServer);

function ListUsers(req, res)
 {
    ReadUsers(OnUsersReaded);
    
    function OnUsersReaded(p_Users)
    {
        LogAndSend(res, JSON.stringify(p_Users, null, "\t"))
    }
 }
 
 function ListUserById(req, res) 
 {
    ReadUsers(OnUsersReaded);
    
    function OnUsersReaded(p_Users)
    {
        if (req.params.id < p_Users.length)
        {
            var l_User = p_Users[req.params.id] 

          LogAndSend(res, JSON.stringify(l_User, null, "\t"))
        }
        else 
        {   
           var l_Error =  "User:" + req.params.id + " not found";
           LogAndSend(res, l_Error);      
     }

    }
 };

function AddUser(req, res) 
{   
    ReadUsers(OnUsersReaded);

    function OnUsersReaded(p_Users)
    {
        // Add to array
        p_Users.push(req.body);    

        LogAndSend(res, JSON.stringify(p_Users, null, "\t"));                 
    }
};

function DeleteUser(req, res) 
{   
    ReadUsers(OnUsersReaded);

    function OnUsersReaded(p_Users)
    {
        // delete from array
        p_Users.splice(req.params.id, 1);
        
        LogAndSend(res, JSON.stringify(p_Users, null, "\t"));                         
    }
};

function ReadUsers(p_Event)
{
    fs.readFile( __dirname + "/" + "users.json", 'utf8', OnReadFile);  

    function OnReadFile(p_Err, p_Data)
    {
        var l_Users = JSON.parse(p_Data);
        p_Event(l_Users)
    }       
}

function LogAndSend(res, p_Data)
{
    console.log( p_Data );
    res.end( p_Data );
}

function ListTraces(req, res)
{
    l_Folder = GetTraceFolder();

    fs.readdir(l_Folder, (err, files) => {
        
        files = files.map(ConcatElem);
        var l_FilesStr = files.join("\n")

        console.log( l_FilesStr );              
        res.end( l_FilesStr );        
      })    

    function ConcatElem(el)
    {
        return l_Folder + el; 
    }
}

function DeleteTrace(req, res) 
{   
    var l_File = GetTraceFolder() + req.params.id;       
    
	if (fs.exists(l_File))
	{
		console.log("delete: " + l_File  );
		fs.unlink(l_File);	
	}
};

function GetTraceFolder()
{
    var l_Folder = "c:/trace";  
    l_Folder = AddTrailingDelimiter(l_Folder);

    return l_Folder;
}

function AddTrailingDelimiter(p_Folder)
{
    if (p_Folder.substr(p_Folder.length-1, 1) != "/")
        p_Folder = p_Folder + "/";

    return p_Folder;
}

function OnSetHeader(req, res, next)
{
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}

function OnInitServer()
{
    var host = server.address().address
    var port = server.address().port
    
    console.log("HelloWorld app listening at http://%s:%s", host, port)
}