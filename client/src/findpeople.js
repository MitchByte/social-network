import axios from "axios";
import { useState, useEffect } from 'react';


export default function FindPeople(props) {
    console.log("FINDPEOPLE.JS: props:", props);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        console.log(`${users} has been rendered`);
        axios
            .get("/find-users")
            .then(({data}) => {
                console.log("findpeople.js: axios.get/find-users", data)

            })
    })

    return  (
        <div>
            <p>Find people</p>
            <input onChange={(e)=> {setUsers(e.target.value)}} defaultValue={users} className="find-input"/>
            <div>
                {users.map(
                    (user, index) => (
                        <div key={user.id}>
                            {user.first} {user.last}
                        </div>
                    )
                )}
            </div>
                            
        </div>

    )


}


