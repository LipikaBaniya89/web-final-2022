import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  ThemeProvider,
} from "react-bootstrap";
import { useLocalStorage } from "react-use";
import QuotationTable from "./QuotationTable";

function Quotation() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [dataItems, setDataItems] = useLocalStorage("dataItems",[]);
  const [itemOptions, setItemOptions] = useState([]);
  const [quotation, setquotation] = useState([]);
  const [price, setPrice] = useState(0);
  const [quotations, setquotations] = useState({
    item : "",
    price: 0,
    quantity : 0
  });

  //Input references
  const itemRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  const dateRef = useRef();

  const [localDataItems, setLocalDataItems, remove] = useLocalStorage(
    "data-items",
    JSON.stringify([])
  );

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((e) => "code" in e);

        console.log(data);
        const z = data.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ));
        setquotation(data);
        setItemOptions(z);
      });
  }, []);

  const saveItem = () => {
    const pid = itemRef.current.value
    let itemName = quotation.find((v) => itemRef.current.value === v._id);
    const newItem = {
      pid: pid,
      item: itemName.name,
      price: priceRef.current.value,
      quantity: quantityRef.current.value
    };

    dataItems.push(newItem);
    setDataItems([...dataItems]);
    console.log(dataItems)

    const newquotation = {
      item: itemName.name,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
    };
    console.log(newquotation);

    fetch(`${API_URL}/quotations`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(newquotation), // body data type must match "Content-Type" header
    })
      .then((res) => res.json())
      .then((json) => {
        // Successfully added the quotation
        console.log("POST Result", json);
        quotation.push(json);
        });
    }

  const updateDataItems = (dataItems) => {
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
  };

  const clearDataItems = () => {
    setDataItems([]);
    setLocalDataItems(JSON.stringify([]));
  };

  const productChange = () => {
    console.log("productChange", itemRef.current.value);
    let item = quotation.find((v) => itemRef.current.value === v._id);
    console.log("productChange", item);
    priceRef.current.value = item.price;
    console.log(priceRef.current.value);
  };

  
  return (
    <Container>
      <Row>
        <Col md={4} style={{ backgroundColor: "#fafafa" }}>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={productChange}>
                {itemOptions}
              </Form.Select>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                ref={priceRef}
                value={price}
                onChange={(e) => setPrice(priceRef.current.value)}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={quantityRef} defaultValue={1} />
            </Col>
          </Row>
          
          <hr />
          <div className="d-grid gap-2">
          <Button variant="success" onClick={saveItem}>
              Save
            </Button>
          </div>
          {/* {JSON.stringify(dataItems)} */}
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            updateDataItems={updateDataItems}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Quotation;
