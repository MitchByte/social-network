import axios from "axios";
import { useState, useEffect } from 'react';



export default function FindPeople(props) {
    console.log("FINDPEOPLE.JS: props:", props);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState();
    const [results, setResult] = useState();

    useEffect(() => {
        console.log(`FINDPEOPLE.JS: useEffect has been rendered`);
        axios
            .get("/find-users")
            .then(({data}) => {
                console.log("FINDPEOPLE.JS: axios.get/find-users", data.users)
                setUsers(data.users);
                console.log("users:", users)
            })
    },[])

    useEffect(() => {
        console.log("searchTerm", searchTerm)
        axios
            .get(`/find/${searchTerm}`)
            .then(({data})=> {
                console.log("/find/searchTerm", data);
                setResult(data.searchTerm)
            })
            .catch((err => {
                console.log("ERROR: FINDPROFILE.JS: axios.get(/find/searchterm): ", err)
            }))
    },[searchTerm])

    return  (
        <div>
            <h2>Find people</h2>
            <p>Are you looking for someone in particular?</p>
            <input name="search" placeholder="Enter name" onChange={(e)=> {setSearchTerm(e.target.value)}} className="find-input"/>
            {!searchTerm && <p>Maybe you know these most recent users?</p> }

            <div className="users">
                {!searchTerm && users.map((user, index) => (
                    <div>
                        <div key={user.id} className="user-box">
                            <img className="user-pic" src={user.imageurl || "/default-profilepic.jpg"}/>
                            <p>{user.firstname} {user.lastname}</p>
                        </div>
                    </div>
                    )
                )}
            </div> 
            <div className="users">
                {searchTerm && <p>Results: {searchTerm}</p>}
                {searchTerm && results.map((user,index) => (
                    <div key={user.id} className="user-box">
                            <img className="user-pic" src={user.imageurl || "/default-profilepic.jpg"}/>
                            <p>{user.firstname} {user.lastname}</p>
                        </div>
                    )
                )}
            </div>                  
        </div>
    )
}


