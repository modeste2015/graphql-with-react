/**
@Author: Heritier Kinke
@Email: modesteheritier@gmail.com
*/

import React, {Component,Fragment} from 'react';


class TableRow extends Component
{
    constructor(props)
    {
        super(props);
        this.state={mode:true,title:this.props.title};

        this.handleOnClickEdit=this.handleOnClickEdit.bind(this);
        this.handleOnClickDelete=this.handleOnClickDelete.bind(this);
        this.handleOnClickUpdate=this.handleOnClickUpdate.bind(this);
        this.handleOnClickCancel=this.handleOnClickCancel.bind(this);

        this.handleOnChangeTitle=this.handleOnChangeTitle.bind(this);
    }
    handleOnClickEdit(event)
    {
        event.preventDefault();
        this.setState({mode:false,title:this.props.title});
    }
    handleOnClickDelete(event)
    {
        event.preventDefault();
        fetch('/graphql',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'},
                body:JSON.stringify({query:`mutation RemoveBook($myID:Int!){
                                                        removeBook(id:$myID){
                                                            id
                                                        }
                                                    }`,
                                    variables:{myID:this.props.id}})
            }).then(r=>r.json()).then(data =>{
                
                if(data.data.errors==undefined)
                {
                    this.props.deleteBook(data.data.removeBook.id);
                }
            });
    }
    handleOnClickUpdate(event)
    {
        event.preventDefault();
        fetch('/graphql',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'},
                body:JSON.stringify({query:`mutation UpdateBook($myID:Int!,$myTitle:String!){
                                                        updateBook(id:$myID,title:$myTitle){
                                                            id,
                                                            title
                                                        }
                                                    }`,
                                    variables:{myID:this.props.id,myTitle:this.state.title}})
            }).then(r=>r.json()).then(data =>{
                if(data.data.errors==undefined)
                {
                    this.props.updateBook(data.data.updateBook);
                    this.setState({mode:true});
                }
            });
    }
    handleOnClickCancel(event)
    {
        event.preventDefault();
        this.setState({mode:true});
    }
    handleOnChangeTitle(event)
    {
        event.preventDefault();
        this.setState({title:event.target.value});
    }
    
    render()
    {
        const{mode}=this.state;

        if(mode)
        {
            return(<tr>
                <td>{this.props.id}</td>
                <td>{this.props.title}</td>
                <td><button className="btn btn-outline-success" onClick={this.handleOnClickEdit}>
                    Edit
                </button></td>
                <td><button className="btn btn-outline-danger" onClick={this.handleOnClickDelete}>
                    Delete
                </button></td>
                </tr>);
        }
        else
        {
            return(<tr>
                <td>{this.props.id}</td>
                <td><input className="form-control" onChange={this.handleOnChangeTitle} value={this.state.title}/></td>
                <td><button className="btn btn-outline-success" onClick={this.handleOnClickUpdate}>
                    Update
                </button></td>
                <td><button className="btn btn-outline-success" onClick={this.handleOnClickCancel}>
                    Cancel
                </button></td>
                </tr>);
        }
    }
}
class App extends Component
{
    constructor(props)
    {
        super(props);
        this.handleOnClickAdd=this.handleOnClickAdd.bind(this);
        this.handleOnChangeTitle=this.handleOnChangeTitle.bind(this);

        this.updateBook=this.updateBook.bind(this);
        this.deleteBook=this.deleteBook.bind(this);

        this.state={books:[],title:""};
    }
    handleOnClickAdd(event)
    {
        event.preventDefault();
        fetch('/graphql',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'},
                body:JSON.stringify({query:`mutation AddBook($mytitle:String!){
                                                        addBook(title:$mytitle){
                                                            id,
                                                            title
                                                        }
                                                    }`,
                                    variables:{mytitle:this.state.title}})
            }).then(r=>r.json()).then(data =>{
                if(data.data.errors==undefined)
                {
                    this.setState({books:[...this.state.books,data.data.addBook]});
                }
            });
    }
    handleOnChangeTitle(event)
    {
        event.preventDefault();
        this.setState({title:event.target.value});
    }
    deleteBook(id)
    {
        this.setState({books:this.state.books.filter(book=> book.id != id)});
    }
    updateBook(book)
    {
        this.setState({books:this.state.books.map(oldBook=> {
            if(oldBook.id == book.id)
            {
                oldBook=Object.assign({},oldBook,book)
            }
            return oldBook;
        })});
    }
    componentDidMount()
    {
        fetch('/graphql',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'},
                body:JSON.stringify({query:"{books{id,title}}"})
            }).then(r=>r.json()).then(data=>{ 
                this.setState({books:data.data.books})})
    }

    render(){
        const {books,title}=this.state;

        return (<Fragment>
        <div className="row">
            <h1 className="col">Manage your Books</h1>
        </div>
        <div className="row">
            <label className="col-sm-2">Title</label>
            <input className="col-sm-8 form-control" onChange={this.handleOnChangeTitle}  
                   placerholder="Title" value={title}/>
            <button className="btn btn-primary col-sm-2" onClick={this.handleOnClickAdd}>
                Add New Book
            </button>
        </div>
        <table className="table mt-4">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {books.map(book =>(<TableRow key={book.id} id={book.id} title={book.title}
                                             deleteBook={this.deleteBook}
                                             updateBook={this.updateBook}/>))}
            </tbody>
        </table>
        </Fragment>);
    }

}


export default App;