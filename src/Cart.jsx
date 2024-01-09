import axios from "axios";
import { useEffect, useState } from "react";
import { BOOKSTORE_CART_URL } from "./Url";

export default function Cart({ user }) {

    const [cart, setCart] = useState([]);
    const [price, setPrice] = useState(0);
    const [orderInfo, setOrderInfo] = useState({name: '', surname: '', post_code: 0, address: '', city: ''});

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

    const createOrder = () => {
        if (orderInfo.name == '') {
            alert('Fill in the name please!');
            return;
        }
        if (orderInfo.surname == '') {
            alert('Fill in the surname please!');
            return;
        }
        if (orderInfo.address == '') {
            alert('Fill in the address please!');
            return;
        }
        if (orderInfo.city == '') {
            alert('Fill in the city please!');
            return;
        }
        if (orderInfo.post_code == 0) {
            alert('Fill in the post code please!');
            return;
        }
        axios({
            method: "POST",
            url: BOOKSTORE_CART_URL+'/orders/'+user,
            data: orderInfo
        }).then(res => {
            document.getElementById('checkoutCollapseButton').click();
            alert('Order sent');
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
                    <button
                            className="btn btn-sm d-inline mb-2 ms-4 px-2 add-to-cart-btn"
                            id="checkoutCollapseButton"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#checkoutCollapse"
                            aria-expanded="false"
                            aria-controls="checkoutCollapse"
                            disabled={cart.length == 0 || user == undefined}
                        >Checkout
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12 col-lg-4">
                    <div class="collapse" id="checkoutCollapse">
                        <div class="card card-body">
                            <p className="orange bold font-24">Shipping information</p>
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter your name" onChange={(e) => {setOrderInfo({...orderInfo, name: e.target.value})}}/>
                            </div>
                            <div class="mb-3">
                                <label for="surname" class="form-label">Surname</label>
                                <input type="text" class="form-control" id="surname" placeholder="Enter your surname" onChange={(e) => {setOrderInfo({...orderInfo, surname: e.target.value})}}/>
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <input type="text" class="form-control" id="address" placeholder="Enter your address" onChange={(e) => {setOrderInfo({...orderInfo, address: e.target.value})}}/>
                            </div>
                            <div class="mb-3">
                                <label for="postCode" class="form-label">Post code</label>
                                <input type="number" min={0} max={9999} class="form-control" id="postcode" placeholder="Enter post code" onChange={(e) => {setOrderInfo({...orderInfo, post_code: parseInt(e.target.value)})}}/>
                            </div>
                            <div class="mb-3">
                                <label for="city" class="form-label">City</label>
                                <input type="text" class="form-control" id="city" placeholder="Enter city" onChange={(e) => {setOrderInfo({...orderInfo, city: e.target.value})}}/>
                            </div>
                            <button className="btn btn-sm d-inline mb-2 mt-2 py-2 add-to-cart-btn" onClick={() => {createOrder()}}>Send order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}