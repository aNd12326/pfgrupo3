import { Box, Container } from "@mui/system";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShoppingCart } from "../../../redux/actions/ShoppingCartView.js";
import ResponsiveAppBar from "../../Features/Header/HeaderMUI.jsx";
import Card from "@mui/material/Card";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Modals from "../../Features/Modals/Modals";
import "../../Features/Modals/Modals.css";
import { CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  removeOneFromCart,
  removeWholeCart,
} from "../../../redux/actions/shoppingCartA.js";
import { useModal } from "../../Features/Modals/useModal.js";
import ShoppingCheckout from "./ShoppingCheckout.jsx";
import styles from "./ShoppingCheckout.module.css";
import emptyCart from "./Img/emptyCart.png";
import Dog from "./Img/Dog.jpg";
import Swal from "sweetalert2";

const stripePromise = loadStripe(
  "pk_test_51LpgGdIsUHqf6y0peEPMdjCDcsjuA2sdBcEGka27crrsnZrTLBpIdJZiAICPkWXYWeJzwabRyk2WtbH0yfdxmGFy0046Eu9UuK"
);

export default function ShoppingView() {
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const { shoppingCartCopy } = useSelector((state) => state.getShoppingCart);
  console.log(shoppingCartCopy);
  const [isOpenModal, openedModal, closeModal] = useModal(false);

  const [userId, setUserId] = useState(
    JSON.parse(localStorage?.getItem("profile")).data.id
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getShoppingCart(userId));
  }, [reducerValue]);

  function handleDeleteOne(e) {
    e.preventDefault();
    dispatch(removeOneFromCart(e.target.value));
    forceUpdate();
  }

  function handleClearCart(e) {
    e.preventDefault();
    dispatch(removeWholeCart(userId));
    forceUpdate();
  }

  if (shoppingCartCopy.total < 1) {
    return (
      <div>
        <ResponsiveAppBar />
        <h1>Your cart is currently empty</h1>
        <img alt="cart" height="400px" width="500px" src={emptyCart} />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div>
        <ResponsiveAppBar />
      </div>
      <div>
        {shoppingCartCopy.items?.map((c) => (
          <Container key={c.cartItemid}>
            <Typography
              gutterBottom
              component="h2"
              sx={{
                fontSize: 18,
                listStyle: "none",
                textDecoration: "none",
              }}
            >
              SHOPPING CART
            </Typography>
            <Card sx={{ maxWidth: 345 }}>
              <Box bgcolor="text.disabled">
                <CardContent>
                  <Typography
                    gutterBottom
                    component="h5"
                    sx={{
                      fontSize: 14,
                      listStyle: "none",
                      textDecoration: "none",
                    }}
                  >
                    {c.name}
                  </Typography>
                  <Typography
                    component={"span"}
                    variant="body2"
                    color="text.secondary"
                  >
                    {`$ ${c.price}`}
                  </Typography>
                  <Typography
                    component={"span"}
                    variant="body2"
                    color="text.secondary"
                  >
                    {`Unit x ${c.quantity}`}
                  </Typography>
                </CardContent>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  handleDeleteOne(e);
                }}
                value={c.cartItemid}
              >
                Delete One
              </Button>
            </Card>
            <Typography
              gutterBottom
              component="h5"
              sx={{
                fontSize: 14,
                listStyle: "none",
                textDecoration: "none",
              }}
            >
              {`Total $ ${shoppingCartCopy.total}`}
            </Typography>
          </Container>
        ))}
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            Swal.fire({
              title: "Warning",
              text: "Are you sure you want to remove all products from the cart?",
              icon: "warning",
              showDenyButton: true,
              denyButtonText: "Cancel",
              confirmButtonText: "Confirm",
              confirmButtonColor: "green",
            }).then((res) => {
              if (res.isConfirmed) {
                handleClearCart(e);
              }
            });
          }}
          value={shoppingCartCopy}
        >
          Clear Cart
        </Button>
        <Button size="small" variant="outlined" onClick={openedModal}>
          Buy
        </Button>
        <Modals isOpenModal={isOpenModal} closeModal={closeModal}>
          <h2 className="modalTitle">MAKE YOUR PET HAPPY!</h2>
          <div>
            <img src={Dog} alt="" width="200px" height="200px" />
          </div>
          <div className={styles.buyInputs}>
            <ShoppingCheckout />
          </div>
          <div>
            <button
              className="modalClose"
              onClick={() => {
                closeModal();
                forceUpdate();
              }}
            >
              CLOSE
            </button>
          </div>
        </Modals>
      </div>
    </Elements>
  );
}