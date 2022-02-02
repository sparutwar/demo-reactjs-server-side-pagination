import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';


function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({meta:'',data:[]});
  const [currentPage,setCurrentPage] = useState(1);
  const [maxPage,setMaxPage] = useState(10);

  function load(page_number){
    setCurrentPage(page_number);

    fetch("https://gorest.co.in/public/v1/users?page="+page_number)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setUsers({meta:result.meta, data:result.data});
        },
      
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  useEffect(() => {load(currentPage);}, []);

  //Only delete from front end
function deleteRow(index){
  console.log("index:"+index);
  const temp = users.data.slice();
  temp.splice(index,1);
  setUsers({meta:users.meta, data:temp})
}

//TODO: id, username, email validate
//Only insert at front end
function insertRow(index){
  const id = prompt("Enter id");
  const name = prompt("Enter Username");
  const email = prompt("Enter email");

  const temp = users.data.slice();
  temp.splice(index,0,{id:id,gender:"Male", name:name,email:email});
  setUsers({meta:users.meta, data:temp})
}

//This is function to create dummy array of pagination for mapping
function pagination()
{
  let arr = [];
  let i=0;
  for(i=0;i<maxPage;i++)
    arr[i]=i;
  return arr;
}

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
   
    return (
        <div class="p-5">
          <table class="table table-bordered table-hover">
            <tbody>
            <tr>
              <th >ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th colspan="2"></th>
            </tr>
            {
            users.data.map((user,index) => {
              return (
              <tr>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td><button class="btn btn-danger" onClick={()=>deleteRow(index)}>Delete</button></td>
                <td><button class="btn btn-primary" onClick={()=>insertRow(index)}>Insert</button></td>
                
              </tr>
                )} )
              }
              </tbody>
          </table>
          
          <div class="container mt-3">
            <ul class="pagination">
              <li class="page-item"><a class="page-link" href="/#" 
              onClick={()=>{
                let temp  = ((currentPage-1)<0)?1:(currentPage-1);
                load(temp);}}>Previous</a></li>

              {
              pagination().map((data,index)=>{
                return(
                <li class="page-item">
                  <a class="page-link" href="/#" onClick={()=>load(index+1)}>{index+1}</a>
                  </li>
                )})
              }

              <li class="page-item"><a class="page-link" href="/#" 
              onClick={()=>{
                let temp  = (currentPage+1)>maxPage?maxPage:(currentPage+1);
                load(temp);}}>Next</a></li>

            </ul>
          </div>
           
        </div>
    );
  }
}


export default App;
