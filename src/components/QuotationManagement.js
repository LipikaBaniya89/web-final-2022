import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Form,
  Container,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus} from "react-icons/fa";

export default function QuotationManagement() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [items, setItems] = useState([]);
    const [itemRows, setItemRows] = useState([]);
    const [modeAdd, setModeAdd] = useState(false);
    const [show, setShow] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [item , setItem] = useState ({
        item: "",
        price: 0,
        quantity: 0,
    });

    useEffect(() => {
        fetch(`${API_URL}/quotations`)
        .then((res) => res.json())
        .then((data) => {
            data.sort(function (a,b) {
                var dateA = new Date(a.date), 
                dateB = new Date(b.date)
	            return dateB - dateA
            })
            console.log(data)
            let sum=0;
            const rows = data.map((e, i) => {
                let amount = e.quantity * e.price;
                sum+=amount;
                return (
                    <tr key={i}>
                        <td>
                            &nbsp;
                            <FaTrash 
                                onClick={() => {
                                    handleDelete(e);
                                }}
                            />
                        </td>
                        <td>{e.item}</td>
                        <td>{e.date}</td>
                        <td>{e.price}</td>
                        <td>{e.quantity}</td>
                        <td>{amount}</td>
                        
                    </tr>
                );
            });
            setItems(data);
            setItemRows(rows);
            setTotalPrice(sum);
        })
    }, []);

    const handleClose = () => {
        setModeAdd(false);
        setShow(false);
    };

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleDelete = (item) => {
        console.log(item);
        if (window.confirm(`Are you sure to delete [${item.item}]?`)) {
          fetch(`${API_URL}/quotations/${item._id}`, {
            method: "DELETE",
            mode: "cors",
          })
            .then((res) => res.json())
            .then((json) => {
                window.location.reload();
                console.log("DELETE Result", json);
                handleClose();
                
                // Successfully deleted
                // for (let i=0; i < items.length; i++) {
                //     if (items[i]._id === item._id) {
                //         items.splice(i,1);
                //         break;
                //     }
                // }
                // let sum =0;
                // const rows = items.map((e, i) => {
                //     let amount = e.quantity * e.price;
                //     sum+=amount;
                //     return (
                //         <tr key={i}>
                //             <td>
                //                 &nbsp;
                //                 <FaTrashAlt
                //                     onClick={() => {
                //                         handleDelete(e);
                //                     }}
                //                 />
                //             </td>
                //             <td>{e.item}</td>
                //             <td>{e.date}</td>
                //             <td>{e.price}</td>
                //             <td>{e.quantity}</td>
                //             <td>{amount}</td>
                           
                //         </tr>
                //     );
                // });
                // setTotalPrice(sum);
                // setItems(items); 
                // setItemRows(rows);
                
               
            });
        }
    };


    return (
        <>
            <Container>
                <h3 style={{marginTop:"20px",fontWeight:"bold" ,textAlign:"center"}}>Quotation Management</h3>
                <Link to={'/quotation'}>
                <Button variant="success" style={{ float:"left", marginTop:"10px",marginBottom: "20px",height:"40px", width:"150px"}}>
                    <FaPlus style={{marginRight:"10px"}}/>
                     Add Item
                </Button>
                </Link>
                

                <table className="table table-striped table-dark table-borderless table-hover" style={{textAlign:"center"}}>
                <thead style={{backgroundColor:"#8B0000"}}>
                    <tr>
                    <th scope="col">Item Operate</th>
                    <th scope="col">Item</th>
                    <th scope="col">Date of Creation</th>
                    <th scope="col">Item Price </th>
                    <th scope="col">Item Quantity</th>
                    <th scope="col">Amount</th>
                    
                    
                    </tr>
                </thead>
                <tbody>{itemRows}</tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}></td>
                        <th>Total Amount Sold</th>
                        <td>{numberWithCommas(totalPrice)}</td>
                    </tr>
                </tfoot> 
                </table>
               
                
            </Container>
        </>
    )

}

