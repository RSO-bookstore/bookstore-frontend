import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { BOOKSTORE_CART_URL, BOOKSTORE_CATALOG_URL } from "./Url";

export default function Admin() {

    const [carts, setCarts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newBook, setNewBook] = useState({title: '', author: '', genre: '', description: '', price: 0, stock_quantity: 0});
    const [editBook, setEditBook] = useState({id: 0, title: '', author: '', genre: '', description: '', price: 0, stock_quantity: 0});

    const GET_BOOKS_QUERY = gql `
    query {
        books {
            id
            title
            author
            price
            stockQuantity
        }
    }
`;

    const { loading, error, data, refetch } = useQuery(GET_BOOKS_QUERY);

    const getUsersCart = () => {
        axios({
            method: 'GET',
            // url: 'http://localhost:8001/cart'
            url: BOOKSTORE_CART_URL + '/cart'
        }).then(res => {
            console.log(res);
            setCarts(res.data);
        }).catch(err => {
            alert(err);
        });
    }

    const getOrders = () => {
        axios({
            method: 'GET',
            url: BOOKSTORE_CART_URL+'/orders'
        }).then(res => {
            console.log(res);
            setOrders(res.data);
        }).catch(err => {
            alert(err);
        });
    }

    useEffect(() => {
        getUsersCart();
        getOrders();
    }, [])

    const removeOneBook = (user, bookID) => {
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

    const createNewBook = () => {
        axios({
           method: 'POST',
        //    url: 'http://localhost:8000/books',
           url: BOOKSTORE_CATALOG_URL+'/books',
           data: newBook
        }).then(res => {
            document.getElementById('newBookCollapseBtn').click();
            alert('Book added');
            refetch();
        }).catch(err => {
            alert(err);
        });
    }

    const getBookInfo = (bookID) => {
        axios({
            method: 'GET',
            // url: 'http://localhost:8000/books/'+bookID,
            url: BOOKSTORE_CATALOG_URL+'/books/'+bookID,
         }).then(res => {
            setEditBook(res.data);
         }).catch(err => {
             alert(err);
         });
    }

    const updateBook = () => {
        axios({
            method: 'PUT',
            // url: 'http://localhost:8000/books/'+editBook.id,
            url: BOOKSTORE_CATALOG_URL+'/books/'+editBook.id,
            data: editBook
        }).then(res => {
            document.getElementById("bookBtn"+editBook.id).click();
            alert('Book updated');
            refetch();
        }).catch(err => {
            alert(err);
        });
    }

    const deleteBook = (bookID) => {
        axios({
            method: 'DELETE',
            // url: 'http://localhost:8000/books/'+bookID
            url: BOOKSTORE_CATALOG_URL+'/books/'+bookID
        }).then(res => {
            alert('Book deleted');
            refetch();
        }).catch(err => {
            alert(err);
        });
    }
    
    const deleteOrder = (orderID) => {
        axios({
            method: 'DELETE',
            url: BOOKSTORE_CART_URL+'/orders/'+orderID
        }).then(res => {
            alert('Order deleted');
            getOrders();
        }).catch(err => {
            alert(err);
        });
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col">
                    <p className="font-24 bold orange d-inline">Books in the store</p>
                    <button
                        className="btn btn-sm d-inline mb-2 ms-4 px-2 add-to-cart-btn"
                        id="newBookCollapseBtn"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#newBookCollapse"
                        aria-expanded="false"
                        aria-controls="newBookCollapse"
                    >Add new book
                    </button>
                </div>
            </div>
            {/* Collapse for new book form */}
            <div class="collapse" id="newBookCollapse">
                <div class="card card-body">
                    <div class="mb-3">
                        <label for="bookTitle" class="form-label">Book's Title</label>
                        <input type="text" class="form-control" id="bookTitle" placeholder="Enter Book's title" onChange={(e) => {setNewBook({...newBook, title: e.target.value})}}/>
                    </div>
                    <div class="mb-3">
                        <label for="bookAuthor" class="form-label">Book's Author</label>
                        <input type="text" class="form-control" id="bookAuthor" placeholder="Enter Book's author" onChange={(e) => {setNewBook({...newBook, author: e.target.value})}}/>
                    </div>
                    <div class="mb-3">
                        <label for="bookGenre" class="form-label">Book's Genre</label>
                        <input type="text" class="form-control" id="bookGenre" placeholder="Enter Book's genre" onChange={(e) => {setNewBook({...newBook, genre: e.target.value})}}/>
                    </div>
                    <div class="mb-3">
                        <label for="bookDescription" class="form-label">Book's Description</label>
                        <textarea rows={5} class="form-control" id="bookDescription" placeholder="Enter Book's Description" onChange={(e) => {setNewBook({...newBook, description: e.target.value})}}/>
                    </div>
                    <div class="mb-3">
                        <label for="bookPrice" class="form-label">Book's price</label>
                        <input type="number" class="form-control" id="bookPrice" placeholder="Enter Book's price" onChange={(e) => {setNewBook({...newBook, price: parseInt(e.target.value)})}}/>
                    </div>
                    <div class="mb-3">
                        <label for="bookStockQuantity" class="form-label">Book's Stock Quantity</label>
                        <input type="number" class="form-control" id="bookStockQuantity" placeholder="Enter Book's stock quantity" onChange={(e) => {setNewBook({...newBook, stock_quantity: parseInt(e.target.value)})}}/>
                    </div>
                    <button className="btn btn-sm d-inline mb-2 mt-2 py-2 add-to-cart-btn" onClick={() => {createNewBook()}}>Create new Book</button>
                </div>
            </div>
            {data.books.map(book => {
                if (book.stockQuantity == 0) return;
                return (
                    <div className="row">
                        <div className="col-12 listing px-5 mx-2 mt-3 pt-3">
                            <div className="row">
                                <button
                                    onClick={() => getBookInfo(book.id)}
                                    id={"bookBtn"+book.id}
                                    data-bs-toggle="collapse"
                                    data-bs-target={"#book"+book.id}
                                    aria-expanded="false"
                                    aria-controls={"book"+book.id}
                                    className="col d-flex justify-content-between align-items-center"
                                    style={{border: 'none', backgroundColor: 'transparent'}}
                                >
                                    <p className="d-inline">#{book.id}</p>
                                    <p className="d-inline">{book.title}</p>
                                    <p className="d-inline">{book.price} €</p>
                                    <p className="d-inline">{book.stockQuantity} left</p>
                                </button>
                            </div>
                            <div className="row">
                                <div class="collapse" id={"book"+book.id}>
                                    <div class="row">
                                        <div className="col">
                                            <div class="mb-3">
                                                <label for="bookTitle" class="form-label">Book's Title</label>
                                                <input type="text" class="form-control" id="bookTitle" placeholder="Enter Book's title" value={editBook.title} onChange={(e) => {setEditBook({...editBook, title: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookAuthor" class="form-label">Book's Author</label>
                                                <input type="text" class="form-control" id="bookAuthor" placeholder="Enter Book's author" value={editBook.author} onChange={(e) => {setEditBook({...editBook, author: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookGenre" class="form-label">Book's Genre</label>
                                                <input type="text" class="form-control" id="bookGenre" placeholder="Enter Book's genre" value={editBook.genre} onChange={(e) => {setEditBook({...editBook, genre: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookDescription" class="form-label">Book's Description</label>
                                                <textarea rows={5} class="form-control" id="bookDescription" placeholder="Enter Book's Description" value={editBook.description} onChange={(e) => {setEditBook({...editBook, description: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookPrice" class="form-label">Book's price</label>
                                                <input type="number" class="form-control" id="bookPrice" placeholder="Enter Book's price" value={editBook.price} onChange={(e) => {setEditBook({...editBook, price: parseInt(e.target.value)})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookStockQuantity" class="form-label">Book's Stock Quantity</label>
                                                <input type="number" class="form-control" id="bookStockQuantity" placeholder="Enter Book's stock quantity" value={editBook.stock_quantity} onChange={(e) => {setEditBook({...editBook, stock_quantity: parseInt(e.target.value)})}}/>
                                            </div>
                                            <div className="mb-3 d-flex justify-content-center">
                                                <button className="btn btn-warning d-inline mb-2 mt-2 mx-3 px-3" onClick={() => {updateBook()}}>Update</button>
                                                <button className="btn btn-danger d-inline mb-2 mt-2 mx-3 px-3" onClick={() => {deleteBook(book.id)}}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            }
            <div className="row mt-5">
                <div className="col">
                    <p className="font-24 bold orange d-inline">Out of stock books</p>
                </div>
            </div>
            {data.books.map(book => {
                if (book.stockQuantity !== 0) return;
                return (
                    <div className="row">
                        <div className="col-12 listing px-5 mx-2 mt-3 pt-3">
                            <div className="row">
                                <button
                                    onClick={() => getBookInfo(book.id)}
                                    id={"bookBtn"+book.id}
                                    data-bs-toggle="collapse"
                                    data-bs-target={"#book"+book.id}
                                    aria-expanded="false"
                                    aria-controls={"book"+book.id}
                                    className="col d-flex justify-content-between align-items-center"
                                    style={{border: 'none', backgroundColor: 'transparent'}}
                                >
                                    <p className="d-inline">#{book.id}</p>
                                    <p className="d-inline">{book.title}</p>
                                    <p className="d-inline">{book.price} €</p>
                                    <p className="d-inline">{book.stockQuantity} left</p>
                                </button>
                            </div>
                            <div className="row">
                                <div class="collapse" id={"book"+book.id}>
                                    <div class="row">
                                        <div className="col">
                                            <div class="mb-3">
                                                <label for="bookTitle" class="form-label">Book's Title</label>
                                                <input type="text" class="form-control" id="bookTitle" placeholder="Enter Book's title" value={editBook.title} onChange={(e) => {setEditBook({...editBook, title: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookAuthor" class="form-label">Book's Author</label>
                                                <input type="text" class="form-control" id="bookAuthor" placeholder="Enter Book's author" value={editBook.author} onChange={(e) => {setEditBook({...editBook, author: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookGenre" class="form-label">Book's Genre</label>
                                                <input type="text" class="form-control" id="bookGenre" placeholder="Enter Book's genre" value={editBook.genre} onChange={(e) => {setEditBook({...editBook, genre: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookDescription" class="form-label">Book's Description</label>
                                                <textarea rows={5} class="form-control" id="bookDescription" placeholder="Enter Book's Description" value={editBook.description} onChange={(e) => {setEditBook({...editBook, description: e.target.value})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookPrice" class="form-label">Book's price</label>
                                                <input type="number" class="form-control" id="bookPrice" placeholder="Enter Book's price" value={editBook.price} onChange={(e) => {setEditBook({...editBook, price: parseInt(e.target.value)})}}/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="bookStockQuantity" class="form-label">Book's Stock Quantity</label>
                                                <input type="number" class="form-control" id="bookStockQuantity" placeholder="Enter Book's stock quantity" value={editBook.stock_quantity} onChange={(e) => {setEditBook({...editBook, stock_quantity: parseInt(e.target.value)})}}/>
                                            </div>
                                            <div className="mb-3 d-flex justify-content-center">
                                                <button className="btn btn-warning d-inline mb-2 mt-2 mx-3 px-3" onClick={() => {updateBook()}}>Update</button>
                                                <button className="btn btn-danger d-inline mb-2 mt-2 mx-3 px-3" onClick={() => {deleteBook(book.id)}}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            }
            <div className="row mt-5">
                <p className="font-24 bold orange">Shopping carts</p>
            </div>
            {carts.length > 0 && carts.map(c => {
                return (
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between px-5 mx-2 mt-3 listing pt-3">
                            <p className="d-inline">User: <b>{c.user_id}</b></p>
                            <p className="d-inline">{c.book.title}</p>
                            <p className="d-inline">{c.book.price} €</p>
                            <div>
                                <p className="d-inline">{c.quantity}x</p>
                                <a className='d-inline btn btn-sm btn-danger ms-2' onClick={() => removeOneBook(c.user_id, c.book.id)}>Remove</a>
                            </div>
                        </div>
                    </div>
                )
            })
            }
            {/* ORDERS */}
            <div className="row mt-5">
                <p className="font-24 bold orange">Orders</p>
            </div>
            {orders.length > 0 && orders.map(order => {
                return (
                    <div className="row">
                        <div className="col-12 px-5 mx-2 mt-3 listing pt-3">
                            <p className="d-inline"><b>#{order.id}</b></p>
                            <p className="d-inline ms-5">User: <b>{order.user_id}</b></p>
                            <p className="d-inline ms-5">Total: <b>{order.price} €</b></p>
                            <div className="mb-1 d-inline float-end">
                                <a className='d-inline btn btn-sm btn-danger ms-2' onClick={() => deleteOrder(order.id)}>Delete</a>
                            </div>
                            <div className="d-block mt-3">
                                <p className="">Name: <b>{order.name}</b> | Surname: <b>{order.surname}</b> | Post code: <b>{order.post_code}</b> | Address: <b>{order.address}</b> | City: <b>{order.city}</b></p>
                            </div>
                            <div className="d-block mt-3">
                                {order.cart.length > 0 && order.cart.map(cart => {
                                    return (
                                        <div>
                                            <p className="">Title: <b>{cart.book.title}</b> | Author: <b>{cart.book.author}</b> | <b>{cart.quantity}x</b> | <b>{cart.book.price}€ / book</b> | <b>{cart.price}€</b></p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}