var express=require('express')
var cors=require('cors')
var {connect}=require("mongoose")
require ("dotenv").config()
var upload=require("express-fileupload")

var Routes=require("./routes/Routes")
var {notFound,errorHandler}=require("./middleware/errorMiddleware")


var app =express()
// app.use(express.json({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:["http://localhost:3000"]}))

app.use(upload())

app.use('/api',Routes)

app.use(notFound)
app.use(errorHandler)

// uVSTA3q1K9kFJihe
const PORT = process.env.PORT || 5000

connect(process.env.MONGO_URL)
	.then(() => {
		app.listen(PORT, () => console.log(`server started on port ${PORT}`))
	})
	.catch(err => console.log(err))