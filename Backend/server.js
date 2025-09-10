var express= require("express");
var app=express();
app.use(express.static("public"));
app.use(express.urlencoded(true));
var nodemailer = require("nodemailer");
var cloudinary=require("cloudinary").v2;
var fileUploader=require("express-fileupload");
app.use(fileUploader());

var mysql2= require("mysql2");

// app.use(express.json());


    // connecting to db
    let dbconfig= "mysql://avnadmin:AVNS__SxktxwBy87P99ml2Hu@mysql-bce-karanksxxx-a6bb.i.aivencloud.com:10904/defaultdb";

    let mysqlserver= mysql2.createConnection(dbconfig);

    mysqlserver.connect(function(err){
        if(err)
        { 
            console.log(err);
        }else{
            console.log("connected to db");
        }
    })
    // ==================================================


app.listen(2000,function(){
    console.log("Server is running on port 2000");
})

app.get("/",function(req,resp){
        dirname=__dirname;
        let fullpath=dirname+"/src/index.html";
        resp.sendFile(fullpath);
})

app.get("/login",function(req,resp){
    resp.sendFile(__dirname+"/src/3login.html");
})

// Signup Components 2signup.html Start
app.get("/signup",function(req,resp){
    resp.sendFile(__dirname+"/src/2signup.html");
})

app.get("/url-signup-process",function(req,resp){
    let all;
    if(req.query.chk==undefined){
        all="no qualification";
    }else{
        let ary=req.query.chk;
        all=ary.toString();
    }
    resp.send("You hae signed up Mr/Mrs: " + req.query.txtname + "<br>Email: " + req.query.txtemail + "<br>Occupation: " + req.query.occu + "<br>Qualification: " + all + "<br>State: " + req.query.state + "<br>Technologies: " + req.query.techs)
})

app.get("/url-login-process",function(req,resp){
    resp.send("Logged In: " + req.query.txtemail + "<br>Password: " + req.query.txtpwd)
})

app.post("/url-signup-process-secure",function(req,resp){
   let str=JSON.stringify(req.body);
   console.log(str);
    resp.send("E-mail: " + req.body.txtemail + "<br> Password: " + req.body.txtpwd );
})
// Signup Components 2signup.html End

//Curd Operations Start with Database
app.get("/curd-signup",function(req,resp){
    resp.sendFile(__dirname+"/src/5curd-profile.html");
})


app.post("/curd-save",function(req,resp){
    let txtEmail=req.body.txtEmail;
    let txtPwd=req.body.txtPwd;
    let txtDob=req.body.txtDob;

    try {
        mysqlserver.query("insert into curdtables values(?,?,?)",[txtEmail,txtPwd,txtDob],function(err){
            if(err==null){
                resp.send("Record Saved......");
            }else{
                resp.send(err.message);
            }
        })
    } catch (error) {
        resp.send(error.message)
    }
})

app.post("/do-delete",function(req,resp){
    mysqlserver.query("delete from curdtables where email=?",[req.body.txtEmail],function(err,result){
        if(err==null){
            if(result.affectedRows==1)
                resp.send("Deleted Successfully......");
            else
                resp.send("No Record Found.");
        }else{
            resp.send(err.message);
        }
    })
})

app.post("/fetchone",function(req,resp){
    mysqlserver.query("select * from curdtables where email=?",[req.body.txtEmail],function(err,result){
        if(result.length==0){
            resp.send("No Record Found.");
        }else
            resp.send(result);
    })
})

app.post("/fetchall",function(req,resp){
    mysqlserver.query("select * from curdtables",function(err,result){
        console.log (result);
        resp.send(result);
    })
})

app.post("/updatedata",function(req,resp){
    mysqlserver.query("update curdtables set password=?, dob=? where email=?",[req.body.txtPwd,req.body.txtDob,req.body.txtEmail],function(err,result){
        if(err==null){
            if(result.affectedRows==1){
                resp.send("Record Updated Successfully.........");
            }else{
                resp.send("In Valid Email");
            }
        }else
                resp.send(err.message);
    })
})


app.get("/do-check-email",function(req,resp){
    mysqlserver.query("select * from curdtables where email=?",[req.query.x],function(err,result){
       
            if(result.length==0)
            {
                resp.send("Available");
            }else
            resp.send("Already Taken");
        
    })
});

app.get("/do-fetch-pwd",function(req,resp)
{
    mysqlserver.query("select password from curdtables where email=?",[req.query.KuchBhi],function(err,resultAry)
    {  
        // console.log(result);
        if(resultAry==0)
                resp.send("Inavlid Emailid");
        else
            resp.send(resultAry);
    })
});

//Curd Operations End with Database

// Angular JS BAsic Starts
app.get("/angular-jsr",function(req,resp){
    resp.sendFile(__dirname+"/src/6angular-jsr.html");
})

app.get("/angular-http",function(req,resp){
    resp.sendFile(__dirname+"/src/7angular-http.html");
})


app.get("/all-records",function(req,resp)
{
    mysqlserver.query("select * from curdtables",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/do-delete-one",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mysqlserver.query("delete from curdtables where email=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Record Deleted Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})


// Angular JS Ends Here


// Nodemailer starts

app.get("/email",function(req,resp){
    resp.sendFile(__dirname+"/src/4email.html");
})

app.post("/sendemail",function(req,resp){
    // app.use(bodyParser.urlencoded({ extended: true }));
    // resp.sendFile(__dirname + "/public/email.html");

    const sender = req.body.from;
    const reciever = req.body.to;
    const about = req.body.subject;
    const boddy = req.body.messages;
    const transporter = nodemailer.createTransport({  
        service: 'gmail',  
        auth: {  
            user: 'karanksxxx@gmail.com',  
            pass: 'vqla xjtv arnf ulpf' // Consider using app-specific passwords or OAuth2 for security  
        }  
}); 

const mailOptions = {  
    from: sender,  
    to: reciever,  
    subject: about,  
    text: boddy  
};  

transporter.sendMail(mailOptions, function(error, info){  
    if (error) {  
        return console.log(error);  
    }  
    console.log('Email sent: ' + info.response);  
    resp.send('Email sent successfully');
}); 
    })

    // Nodemailer Ends here

    // Cloudinary Process Starts

    
cloudinary.config({ 
    cloud_name: 'dbvdxepqe', 
    api_key: '116987294548589', 
    api_secret: 'SQ3xj_ETHnyn8n8A6x2aOWW3CeE' // Click 'View API Keys' above to copy your API secret
});

app.get("/cloudinary-process",function(req,resp){
    resp.sendFile(__dirname + "/src/8imageupload.html");
})

app.post("/url-image-upload",async function(req,resp){
    
    let filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.profpic.name;
        let locationToSave=__dirname + "/src/uploads/" + filename;
        req.files.profpic.mv(locationToSave);

        await cloudinary.uploader.upload(locationToSave).then(function(picURLresult){
            filename=picURLresult.url;
            console.log(filename);
        }); 
    }
        let str=JSON.stringify(req.body);
        resp.send("Profile Pic: " + filename);
    
})

// Cloudinary Process Ends here