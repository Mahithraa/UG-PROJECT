import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';




const AdminShowReport = ({ onFilter }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    console.log("sd>>>>",startDate);
    console.log("ed>>>>",endDate);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        
      };
    
      const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
       
      };
    
    //   const handleFilterClick = () => {
    //     // Pass the start and end dates to the parent component for filtering
    //     onFilter(startDate, endDate);
    //   };

    const handleFilter = () => {
        axios.get(`/api/filterData`, { startDate, endDate })
            .then((response) => {
                setFilteredData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching filtered data:', error);
            });
    };

    return (
        <>

            <div className="order_user_history  container-fluid" >

                <h2>Orders</h2>
                <input type="date" value={startDate} onChange={handleStartDateChange} /><br></br>
                <input type="date" value={endDate} onChange={handleEndDateChange} />
                <button onClick={handleFilter}>Filter Data</button>
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

                                        filteredData.map(order => (

                                            <tr key={order?._id}>
                                                <th scope="col">{order?._id}</th>
                                                <th scope="col">{order?.user.name}</th>
                                                <th scope="col">{order?.itemsPrice.toFixed(2)}</th>
                                                <th scope="col">{order?.isPaid ? (<span style={{ color: "green" }}>Paid</span>) : (<span style={{ color: "#ffc107" }}>Processing</span>)}</th>
                                                <th scope="col"> {order?.isDelivered ? (<span style={{ color: "green" }}>Yes</span>) : (<span style={{ color: "#ffc107" }}>No</span>)}</th>
                                                <th scope="col">{order?.isPaid && order?.isDelivered ? moment(order?.deliveredAt).format('YYYY/MM/DD HH:MM:SS') : ''}</th>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </>

            </div>


        </>
    )
}

export default AdminShowReport;
