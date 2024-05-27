import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'antd/dist/antd.css';
import { Pagination, Input, DatePicker } from 'antd';
import { toast } from 'react-toastify'
import moment from 'moment';
import Loading from '../component/Loading'

const { Search } = Input;

const AdminShowOrders = () => {

    const [ord, setOrd] = useState([]);
    const [singleOrder, setSingleOrder] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItem, setTotalItem] = useState(0);
    const [shippingAddressload, setShippingAddressload] = useState({});
    const [taxpriceload, setTaxpriceload] = useState('')
    const [totalpriceload, setTotalpriceload] = useState('')
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState(null);

    //show orders
    const displayAdminOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/orders/all?pageNumber=${pageNumber}`);
            if (data) {
                setOrd(data.orders);
                setTotalItem(data.count);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }

    }
    // Function to handle search
    const fetchOrdersByDateRange = async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/filterData/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`);
            if (response.data && response.data.orders) {
                setOrd(response.data.orders);
                setTotalItem(response.data.orders.length);
                console.log("response.data.orders>>>>", response.data.orders); // Assuming count is not provided by the backend
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders by date range:', error);
            setLoading(false);
        }
    };
    // Function to handle date selection for filtering
    const handleDateRangeChange = (dates) => {
        setSelectedDateRange(dates);
        if (dates && dates.length === 2) {
            const [startDate, endDate] = dates;
            fetchOrdersByDateRange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        } else {
            // If dates are not selected, reset to default
            displayAdminOrders();
        }
    }
    useEffect(() => {
        displayAdminOrders();
    }, [pageNumber]);




    //display single order for admin
    const singleOrderAdmin = async (id) => {
        if (id) {
            try {
                const { data } = await axios.get(`/api/ordersingle/admin/${id}`);
                if (data) {
                    setSingleOrder(data.singleOrder.orderItems);
                    setShippingAddressload(data.singleOrder.shippingAddress);
                    setTaxpriceload(data.singleOrder.taxPrice);
                    setTotalpriceload(data.singleOrder.totalPrice)
                }

            } catch (error) {
                console.log(error);
            }
        }
    }


    //Deleting an order
    const deleteOrder = (id) => {

        if (window.confirm(`Do you want to delete Order: ${id}`)) {
            //console.log(`current user ID: ${id} / ${name}`);
            axios.delete(`/api/orderdelete/admin/${id}`)

                .then(result => {
                    if (result) {
                        //console.log("User deleted");
                        displayAdminOrders();
                        toast.success(`current order ID: ${id}  deleted`)
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    const handlePrint = () => {
        // Hide the body content except for the modal
        const bodyContent = document.body.innerHTML;
        document.body.innerHTML = document.querySelector('.modal-content').innerHTML;
    
        // Function to restore the body content
        const restoreBodyContent = () => {
            document.body.innerHTML = bodyContent;
        };
    
        // Trigger the print functionality
        window.print();
    
        // Restore the body content after a timeout
        setTimeout(() => {
            restoreBodyContent();
            // Reload the entire page
            window.location.reload();
        }, 1000); // Adjust the timeout as needed
    };
    

    //confirm payment an order
    const confirmOrderPayment = (id) => {

        if (window.confirm(`Do you want to confirm Order payment: ${id}`)) {
            //console.log(`current user ID: ${id} / ${name}`);
            axios.put(`/api/orderupdate/admin/pay/${id}`)
                .then(result => {
                    if (result) {
                        toast.success(`current order ID: ${id}  paid`);
                        displayAdminOrders();
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }



    //confirm delivered order
    const orderDeliveredHome = (id) => {

        if (window.confirm(`Do you want to confirm Order : ${id} delivery?`)) {
            //console.log(`current user ID: ${id} / ${name}`);
            axios.put(`/api/orderdelivered/admin/${id}`)
                .then(result => {
                    if (result) {
                        toast.success(`current order ID: ${id}  is delivered!`);
                        displayAdminOrders();
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }


    return (
        <>

            <div className="order_user_history  container-fluid" >

                <h2>Orders</h2>
                {/* <Search
                    placeholder="Search by Order ID"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={handleSearch}
                /> */}
                {
                    loading ?
                        <Loading />
                        :
                        <>
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">OrderID</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Paid</th>
                                        <th scope="col">Delivered</th>
                                        <th scope="col">Delivered At</th>
                                        <th scope="col">Actions  </th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {
                                        // orders && orders.length === 0 ? <><h2>Your don't have any purcharse</h2></> :  

                                        ord.map(order => (

                                            <tr key={order?._id}>
                                                <th scope="col">{order?._id}</th>
                                                <th scope="col">{order?.user.name}</th>
                                                <th scope="col">{order?.itemsPrice.toFixed(2)}</th>
                                                <th scope="col">{order?.isPaid ? (<span style={{ color: "green" }}>Paid</span>) : (<span style={{ color: "#ffc107" }}>Processing</span>)}</th>
                                                <th scope="col"> {order?.isDelivered ? (<span style={{ color: "green" }}>Yes</span>) : (<span style={{ color: "#ffc107" }}>No</span>)}</th>
                                                <th scope="col">{order?.isPaid && order?.isDelivered ? moment(order?.deliveredAt).format('YYYY/MM/DD HH:MM:SS') : ''}</th>

                                                <th scope="col">
                                                    <span > <i data-mdb-toggle="modal" data-mdb-target="#exampleModal" style={{ cursor: "pointer" }} onClick={() => singleOrderAdmin(order?._id)} className="fa-regular fa-eye"></i></span>
                                                    <span><i onClick={() => confirmOrderPayment(order?._id)} className="fa-solid fa-dollar-sign" style={{ cursor: "pointer", paddingLeft: "20px", color: "green" }}></i></span>
                                                    <span><i onClick={() => orderDeliveredHome(order?._id)} className="fa-solid fa-house-chimney" style={{ cursor: "pointer", marginLeft: "20px" }}></i></span>
                                                    <span><i onClick={() => deleteOrder(order?._id)} className="far fa-trash-alt btn-danger" style={{ cursor: "pointer", marginLeft: "20px" }}></i></span>
                                                </th>

                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </>
                }



                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 style={{ color: "white" }} className="modal-title" id="exampleModalLabel">Purchase Details</h5>
                                <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <table className="table">

                                    <thead className="">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Price </th>
                                            <th scope="col">image</th>
                                            <th scope="col">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody className='ordersdetailsBody'>

                                        {
                                            //  orders && orders.length === 0 ? <><h2>Your don't have any purcharse</h2></> :  

                                            singleOrder && singleOrder.map(det => (

                                                <tr key={det?._id}>
                                                    <th scope="col">{det?.name}</th>
                                                    <th scope="col">{det?.price}</th>
                                                    <th scope="col"><img style={{ maxWidth: "40%" }} src={det?.image} alt={det?.name} /></th>
                                                    <th scope="col">{det?.quantity}</th>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <hr />

                                <div className="shipping_details_info">
                                    <h6>shipping info: </h6>
                                    <ul>
                                        <li><b>Complete name: </b> {shippingAddressload?.fullName} </li>
                                        <li><b>Address: </b> {shippingAddressload?.address}, {shippingAddressload?.city}, {shippingAddressload?.country}, {shippingAddressload?.postalCode}</li>
                                        <li><b>cellphone: </b> {shippingAddressload?.cellPhone} </li>
                                    </ul>
                                    <h6>Payment Info</h6>
                                    <ul>
                                        <li><b>Tax Price: </b>{taxpriceload}</li>
                                        <li><b>Total Price: </b>{totalpriceload}</li>
                                    </ul>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-mdb-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-mdb-dismiss="modal" onClick={handlePrint} >Print</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Pagination current={pageNumber} total={totalItem} onChange={(value) => setPageNumber(value)} />
            </div>


        </>
    )
}

export default AdminShowOrders