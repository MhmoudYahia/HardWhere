import "./Cart.css";
import { BsFillCartDashFill } from "react-icons/bs";
import { BsFillCartPlusFill } from "react-icons/bs";
import { CiCircleRemove } from "react-icons/ci";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { BsCartCheckFill } from "react-icons/bs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useLocation } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";

const Cart = () => {
  const { state } = useLocation();
  const customer_ssn = state.ssn;

  const [shippingName, setShippingName] = useState("-1");
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingTime, setShippingTime] = useState(0);
  const [shippingData, setShippingData] = useState([]);
  const [orderCnt, setOrderCnt] = useState(0);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const getOrderCnt = JSON.parse(localStorage.getItem("orderCnt"));
    if (getOrderCnt) {
      setOrderCnt(Number(getOrderCnt));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orderCnt", JSON.stringify(orderCnt));
  }, [orderCnt]);

  const getDatatoCart = async () => {
    try {
      const data = await fetch(
        `http://localhost:1444/api/v1/Cart?ssn=${customer_ssn}`
      );
      const data2 = await data.json();
      console.log(data2);
      setProductData(data2[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDatatoCart();
  }, []);

  const getShippingData = async () => {
    try {
      const data = await fetch(
        "http://localhost:1444/api/v1/shippingCompany_Data"
      );
      const data2 = await data.json();
      setShippingData(data2[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getShippingData();
  }, []);

  async function RemoveProduct(id) {
    try {
      console.log("del");
      await fetch(
        `http://localhost:1444/api/v1/Cart/del/${id}?ssn=${customer_ssn}`,
        {
          method: "DELETE",
        }
      );
      getDatatoCart();
    } catch (error) {
      console.log(error);
    }
  }

  let total = 0;
  return (
    <main style={{ position: "relative" }}>
      <div className="cartLayout"></div>
      <h1>My Cart</h1>

      <div className="cartContainer">
        <div className="myproducts">
          {productData.map((product, index) => {
            let totalProductPrice = 0;
            // const [count,setcount]=useState(0);
            totalProductPrice = Number(product.qty) * Number(product.price);
            // settotal(total + totalProductPrice);
            total += totalProductPrice;

            return (
              <div className="productInCart">
                <img
                  src="https://www.bestshop.com.py/img/1000x1000/products/13749/13749.jpg"
                  alt=""
                />
                <div className="data">
                  <h3>{product.product_name}</h3>
                  <div className="price">
                    <span>{Number(product.qty) === 0 ? 0 : product.qty}</span> *{" "}
                    <span>{(+product.price).toFixed(2)}</span>
                    &nbsp; &nbsp; &nbsp;
                    <span style={{ color: "red" }}>
                      ${totalProductPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className={`message${product.pid}`} id="noMoreMessage">
                  No More
                </div>
                <BsFillCartDashFill
                  onClick={async () => {
                    try {
                      await fetch(
                        `http://localhost:1444/api/v1/Cart/decQty/${product.pid}?ssn=${customer_ssn}`,
                        { method: "PATCH" }
                      );
                      if (product.qty === 1) {
                        RemoveProduct(product.pid);
                      }
                      if (product.totalCnt === 0) {
                        document.querySelector(
                          `.message${product.pid}`
                        ).style.display = "none";
                      }
                      getDatatoCart();
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  className="BsFillCartDashFill"
                ></BsFillCartDashFill>
                <BsFillCartPlusFill
                  onClick={async () => {
                    if (product.totalCnt !== 0) {
                      try {
                        await fetch(
                          `http://localhost:1444/api/v1/Cart/incQty/${product.pid}?ssn=${customer_ssn}`,
                          { method: "PATCH" }
                        );
                        getDatatoCart();
                        console.log("inc");
                      } catch (error) {
                        console.log(error);
                      }
                    } else {
                      document.querySelector(
                        `.message${product.pid}`
                      ).style.display = "block";
                    }
                  }}
                  className="BsFillCartPlusFill"
                ></BsFillCartPlusFill>

                <CiCircleRemove
                  onClick={() => {
                    RemoveProduct(product.pid);
                  }}
                  className="Xremove"
                ></CiCircleRemove>
              </div>
            );
          })}
        </div>
        <div className="summary">
          <h4>Cart Summary</h4>
          <hr />
          <br />
          <span
            style={{ fontWeight: "900", fontSize: "22px", color: "cadetblue" }}
          >
            Total Price:
          </span>
          &nbsp;{" "}
          <span
            style={{ color: "salmon", fontWeight: "bolder", fontSize: "22px" }}
          >
            ${total.toFixed(2)}
          </span>
          <br />
          <br />
          <hr />
          <br />
          <h4>Shipping Company</h4>
          <div>
            {Array.isArray(shippingData) && shippingData.length > 0 ? (
              <FormControl sx={{ m: 1, minWidth: 222 }}>
                <InputLabel id="demo-select-small" style={{ color: "salmon" }}>
                  Company Name
                </InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={shippingName === "-1" ? "" : shippingName}
                  label="Company Name"
                  defaultValue="choose"
                  onChange={(e) => {
                    setShippingName(e.target.value);
                    const result = shippingData.find(
                      (item) => item.sc_name === e.target.value
                    );
                    setShippingCost(result.cost);
                    setShippingTime(result.delivery_time);
                  }}
                >
                  {shippingData.map((data) => (
                    <MenuItem value={data.sc_name}>{data.sc_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <div>kkkkkkkk</div>
            )}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                type="text"
                defaultValue={"Choose the Company"}
                value={shippingCost}
                variant="outlined"
                inputProps={{ readOnly: true }}
                on
              />
              <FormHelperText style={{ color: "salmon" }}>Cost</FormHelperText>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                type="text"
                defaultValue="Choose the Company"
                value={shippingTime}
                variant="outlined"
                inputProps={{ readOnly: true }}
              />
              <FormHelperText style={{ color: "salmon" }}>
                Delivery Time
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <Button
              variant="contained"
              endIcon={<BsCartCheckFill style={{ color: "#87ff87" }} />}
              style={{ margin: "25px 0 25px 10px" }}
              onClick={async (e) => {
                const date = new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                try {
                  const result = shippingData.find(
                    (item) =>
                      item.sc_name === shippingName &&
                      item.cost === shippingCost &&
                      item.delivery_time === shippingTime
                  );

                  const res = await fetch(
                    `http://localhost:1444/api/v1/addtoOrders`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        orderCnt,
                        total: total + shippingCost,
                        date,
                        cust_ssn: customer_ssn,
                        scid: result === undefined ? -1 : result.scid,
                      }),
                    }
                  );
                  if (res.status === 200) {
                    setOrderCnt(orderCnt + 1);

                    document
                      .getElementById("messageOrderSuccess")
                      .classList.add("active");
                  }
                  setTimeout(() => {
                    document
                      .getElementById("messageOrderSuccess")
                      .classList.remove("active");
                  }, 3000);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              Buy Now
            </Button>
            <div id="messageOrderSuccess">
              Ordered Add Successfully <CheckIcon />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
