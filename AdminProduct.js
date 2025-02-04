import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../action/productAction'
import { Link } from 'react-router-dom'
import axios from "axios"
import { toast } from 'react-toastify'
import 'antd/dist/antd.css';
import { Pagination } from 'antd';
import Loading from '../component/Loading'

const AdminProduct = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { loading, products, count, page, error } = productList

    useEffect(() => {
        dispatch(listProducts(pageNumber))
    }, [dispatch, pageNumber, page])

    //Delete product
    const deleteProduct = (id, name) => {

        if (window.confirm(`Are you sure, you want to delete Product: ${name}`)) {
            axios.delete(`/api/product/delete/${id}`)
                .then(prod => {
                    if (prod) {
                        toast.success(`Product name: ${name} was deleted`);
                        //update product list after deleting product
                        dispatch(listProducts());
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }

    }

    return (
        <>
            <div className="container-fluid " >
                <h2>List of products</h2>
                <div className="btn_div_button" style={{ display: "flex", justifyContent: "right" }}>
                    <Link to="/admin/product/create" className="btn btn-default btn-primary "> + Create product</Link>
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
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Stock</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Category</th>
                                        <th scope='col'>Seller</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products && products.map((product, id) => (

                                            <tr key={id}>
                                                <th scope="row">{product._id}</th>
                                                <td>{product.name}</td>
                                                <td>{product.countStock}</td>
                                                <td>{product.price}</td>
                                                <td>{product.category ? product.category.name : ""}</td>
                                                <td>{product.seller}</td>
                                                <td><Link to={`/admin/product/edit/${product._id}`}> <i className="fas fa-edit btn-primary"></i></Link></td>
                                                <td style={{ cursor: "pointer" }} onClick={() => deleteProduct(product._id, product.name)}><i className="far fa-trash-alt btn-danger"></i></td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </>
                }
                <Pagination current={pageNumber} total={count} onChange={(value) => setPageNumber(value)} pageSize={8} />
            </div>
        </>
    )
}

export default AdminProduct