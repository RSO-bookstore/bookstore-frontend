import axios from "axios";
import { useEffect, useState } from "react";
import { BOOKSTORE_CART_URL } from "./Url";

export default function Cart({ user }) {

    const [cart, setCart] = useState([]);
    const [price, setPrice] = useState(0);

    const getUsersCart = () => {
        axios({
            method: 'GET',
            // url: 'http://localhost:8001/cart/'+user
            url: BOOKSTORE_CART_URL+'/cart/'+user
        }).then(res => {
            console.log(res);
            setCart(res.data.cart);
            setPrice(res.data.price);
        }).catch(err => {
            alert(err);
        });
    }

    useEffect(() => {
        getUsersCart();
    }, [])

    const removeOneBook = (bookID) => {
        axios({
            method: 'DELETE',
            // url: 'http://localhost:8001/cart/'+user+'/'+bookID
            url: BOOKSTORE_CART_URL+'/cart/'+user+'/'+bookID
        }).then(res => {
            getUsersCart();
        }).catch(err => {
            alert(err);
        });
    }

    return (
        <div className="container my-4">
            <div className="row">
                <p className="font-24 bold orange">Your Cart</p>
            </div>
            {cart.map(c => {
                return (
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between px-5 mx-2 mt-3 listing pt-3">
                            <p className="d-inline">{c.book.title}</p>
                            <p className="d-inline">{c.book.price} €</p>
                            <div>
                                <p className="d-inline">{c.quantity}x</p>
                                <a className='d-inline btn btn-sm btn-danger ms-2' onClick={() => removeOneBook(c.book.id)}>Remove</a>
                            </div>
                            <p className="d-inline">{c.price} €</p>
                        </div>
                    </div>
                )
            })
            }
            <div className="row mt-4">
                <div className="col">
                    <p className="d-inline font-24 bold orange mt-4">Total: {price} €</p>
                    {/* <button
                            className="btn btn-sm d-inline mb-2 ms-4 px-2 add-to-cart-btn"
                            id=""
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#checkoutCollapse"
                            aria-expanded="false"
                            aria-controls="checkoutCollapse"
                            disabled={cart.length == 0}
                        >Checkout
                    </button> */}

                </div>
            </div>

            <div className="row">

            </div>
        </div>
    )
}