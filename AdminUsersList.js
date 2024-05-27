import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'antd/dist/antd.css';
import { Pagination,  Input } from 'antd';
import Loading from '../component/Loading'

const { Search } = Input; 
const AdminUsersList = () => {

    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = () => {
        setLoading(true);
        let url = `/api/allusers?pageNumber=${pageNumber}`;
        if (searchTerm) {
            // If searchTerm exists, fetch user by ID
            // url = `/api/allusers?searchTerm=${searchTerm}`;
            url += `&searchTerm=${searchTerm}`;
        }
        axios
        .get(url)
        //axios.get(`/api/allusers?pageNumber=${pageNumber}&searchTerm=${searchTerm}`)
            .then((res) => {
                    setUsers(res.data.users);
                    setTotalItem(res.data.count);
                    setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadUsers();
    }, [pageNumber, searchTerm]);


    //Deleting an user
    const deleteUser = (id, name) => {

        if (window.confirm(`Do you want to delete User: ${name}`)) {
            axios.delete(`/api/admin/user/delete/${id}`)
                .then((result) => {
                    if (result) {
                        //console.log("User deleted");
                        loadUsers();
                        toast.success(`current user ID: ${id} / ${name} deleted`)
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    return (
        <>

            <div className="container-fluid " >
                <h2>Registred Users</h2>
                <div style={{ marginBottom: '20px' }}> {/* Add a container for the search input */}
                    {/* <Search
                        placeholder="Search by ID"
                        allowClear
                        enterButton="Search"
                        onSearch={value => setSearchTerm(value)}
                        style={{ width: 300 }}
                    /> */}
                    <input
                    type="text"
                    placeholder="Search by ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => loadUsers()}>Search</button>
                </div>
                {
                    loading ?
                        <Loading />
                        :
                        <>
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col"> Name</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users && users.map((user, id) => (

                                            <tr key={id}>
                                                <th scope="row">{user._id}</th>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role === 1 ? "Admin" : "User"}</td>
                                                <td><Link to={`/admin/user/edit/${user._id}`}> <i className="fas fa-edit btn-primary"></i></Link></td>
                        
                                                <td><i onClick={() => deleteUser(user._id, user.name)} className="far fa-trash-alt btn-danger" style={{ cursor: "pointer" }}></i></td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>

                        </>
                }

                <Pagination current={pageNumber} total={totalItem} onChange={(value) => setPageNumber(value)} pageSize={15} />
            </div>
        </>
    )
}

export default AdminUsersList;