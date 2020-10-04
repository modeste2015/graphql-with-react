/**
@Author: Heritier Kinke
@Email: modesteheritier@gmail.com
*/

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList,
    GraphQLSchema,
    GraphQLInt
} =require('graphql');


const books={

    byId:
    {
        0:{
            id:0,
            title:'Project Management'
        },
        1:{
            id:1,
            title:'Introduction to Material Managements'
        },
        2:{
            id:2,
            title:'Human Resource Management'
        }
    },
    allId:[0,1,2]
}

let id=100;
const createId=()=>{
    return id++;
}
const BookType=new GraphQLObjectType({
    name:'book',
    fields:()=>({
        id:{type:GraphQLInt},
        title: {type:GraphQLString}
    })
});

const rootQuery=new GraphQLObjectType({
    name: 'Query',
    fields:()=>({
        books:{
            type:GraphQLList(BookType),
            resolve: () => books.allId.map(id=> books.byId[id])
        },
        book:{
            type:BookType,
            args:{
                id:{ type:GraphQLInt,defaultValue:0}
            },
            resolve:(obj,args)=>{return books.byId[args.id]}
        }
    })
});


const rootMutation=new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addBook:{
            type:BookType,
            args:{
                title:{type:GraphQLString},
            },
            resolve:(obj,args)=>{
                const id=createId();
                books.allId=[...books.allId,id];
                books.byId[id]={id:id,title:args.title};
                return books.byId[id];
            }
        },
        updateBook:{
            type:BookType,
            args:{
                title:{type:GraphQLString},
                id:{type:GraphQLInt}
            },
            resolve:(obj,args)=>{
                if(books.byId[args.id] == undefined)
                {
                    throw Error("book does not exist");
                }
                Object.assign(books.byId[args.id],{title:args.title});
                return books.byId[args.id];
            }
        },
        removeBook:{
            type:BookType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(obj,args)=>{
                if(books.byId[args.id] == undefined)
                {
                    throw Error("book does not exist");
                }
                const  book=books.byId[args.id];
                books.allId=books.allId.filter(id=> id != args.id);
                delete books.byId[args.id];
                return book;
            }
        }
    }
})

const mySchema=new GraphQLSchema({
    query:rootQuery,
    mutation:rootMutation
})

module.exports=mySchema;
