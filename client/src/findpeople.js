import axios from "axios";
import { useState, useEffect } from 'react';
import ProfilePic from "./profilepic";



export default function FindPeople(props) {
    console.log("FINDPEOPLE.JS: props:", props);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);


    useEffect(() => {
        console.log(`FINDPEOPLE.JS: useEffect has been rendered`);
        axios
            .get("/find-users")
            .then(({data}) => {
                console.log("FINDPEOPLE.JS: axios.get/find-users", data)
                setUsers(data);
                console.log("users:", users)
            })
    },[])

    return  (
        <div>
            <p>Find people</p>
            <p>Maybe you know these following?</p>
            <p>Or are you looking for someone in particular?</p>
            <input name="search" placeholder="Enter name" onChange={(e)=> {setSearchTerm(e.target.value)}} defaultValue={users} className="find-input"/>
            <div>
                {users.map((user, index) => (
                        <div key={user.id}>
                            <p>
                                {user.first} {user.last}
                            </p>
                            <img className="find.people-pic" src={user.imageUrl || "/default-profilepic.jpg"}/>

                        </div>
                    )
                )}
            </div>
                            
        </div>

    )


}


