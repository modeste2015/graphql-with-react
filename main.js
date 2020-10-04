/**
@Author: Heritier Kinke
@Email: modesteheritier@gmail.com
*/

const express=require('express');
const {graphqlHTTP}=require('express-graphql');
const mySchema=require('./graphqlschemes');


const app=express()

app.use('/',express.static('./public'));

app.use('/graphql',graphqlHTTP({
    schema:mySchema,
    graphiql:false
}));

app.get('/',(req,res)=>{
    res.sendFile('./public/index.html');
});

app.listen(4000,()=>{
    console.log("Server is Running");
});

