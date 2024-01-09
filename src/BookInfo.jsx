import { useQuery, gql } from "@apollo/client";
import axios from "axios";
import { useState } from "react";
import { BOOKSTORE_CART_URL, BOOKSTORE_CATALOG_URL } from "./Url";

export default function BookInfo({ bookID, user }) {

    const [translatedBook, setTranslatedBook] = useState(null);

    const GET_BOOK_QUERY = gql `
        query ($bookID: ID!) {
            book(id: $bookID) {
                id
                title
                author
                price
                genre
                stockQuantity
                description
            }
        }
    `;
    let { loading, error, data, refetch } = useQuery(GET_BOOK_QUERY, { variables: { bookID }});

    const addToCart = () => {
        if (user === null) {
            alert('Select one user');
            return;
        }

        let data = {
           book_id: bookID,
           quantity: 1 
        };

        axios({
            method: 'POST',
            // url: 'http://localhost:8001/cart/'+user,
            url: BOOKSTORE_CART_URL+'/cart/'+user,
            data: data
        }).then(res => {
            console.log(res);
            if (res.status == 201) {
                alert('Item added to cart.');
            }
        }).catch(err => {
            alert(err);
        });

        data = {
            change: -1
        };
        axios({
            method: 'PUT',
            // url: 'http://localhost:8000/books/'+bookID+'/quantity',
            url: BOOKSTORE_CATALOG_URL+'/books/'+bookID+'/quantity',
            params: data
        }).then(res => {
            refetch();
        }).catch(err => {
            alert(err);
        })
    }

    const translateBook = (lang) => {
        axios({
            method: 'GET',
            // url: 'http://localhost:8000/books/'+bookID+'/translate',
            url: BOOKSTORE_CATALOG_URL+'/books/'+bookID+'/translate',
            params: {dest_lang: lang}
        }).then(res => {
            console.log(res.data);
            setTranslatedBook(res.data);
        }).catch(err => {
            alert(err);
        });
    }

    return (
        <div className="container my-4">
            <div className="row">
                <p className="font-24 bold orange">Book information</p>
            </div>
            <div className="row">
                <div className="col-12 px-5 mx-2 mt-3 book-info-panel py-3">
                    {loading && 
                        <p>Loading...</p>
                    }
                    {error &&
                        <p>Error: {error.message}</p>
                    }
                    {(data && translatedBook == null) && 
                        <div className="row">
                            <div className="col-4">
                                <p className="font-24"><b>{data.book.title}</b></p>
                                <p className="">Book ID: <b>#{data.book.id}</b></p>
                                <p className="">Author: <b>{data.book.author}</b></p>
                                <p className="">Genre: <b>{data.book.genre}</b></p>
                                <p className="">Availability: <b>{data.book.stockQuantity} left</b></p>
                                <p className="font-24 orange d-inline"><b>{data.book.price} €</b></p>
                                <button disabled={data.book.stockQuantity == 0} className="btn btn-sm d-inline mb-2 ms-4 px-2 add-to-cart-btn" onClick={() => addToCart()}>ADD TO CART</button>
                            </div>
                            <div className="col-8 pt-2">
                                <p className="d-inline"><b>Description</b></p>
                                <button className="btn btn-sm d-inline mb-1 ms-4 px-2 translate-btn" onClick={() => translateBook('en')}>ENGLISH</button>
                                <button className="btn btn-sm d-inline mb-1 ms-2 px-2 translate-btn" onClick={() => translateBook('de')}>DEUTSCH</button>
                                <button className="btn btn-sm d-inline mb-1 ms-2 px-2 translate-btn" onClick={() => translateBook('es')}>ESPAÑOL</button>
                                <p className="mt-2">{data.book.description}</p>
                            </div>
                        </div>
                    }
                    {(data && translatedBook != null) && 
                        <div className="row">
                            <div className="col-4">
                                <p className="font-24"><b>{translatedBook.title}</b></p>
                                <p className="">Book ID: <b>#{translatedBook.id}</b></p>
                                <p className="">Author: <b>{translatedBook.author}</b></p>
                                <p className="">Genre: <b>{translatedBook.genre}</b></p>
                                <p className="">Availability: <b>{translatedBook.stock_quantity} left</b></p>
                                <p className="font-24 orange d-inline"><b>{translatedBook.price} €</b></p>
                                <button className="btn btn-sm d-inline mb-2 ms-4 px-2 add-to-cart-btn" onClick={() => addToCart()}>ADD TO CART</button>
                            </div>
                            <div className="col-8 pt-2">
                                <p className="d-inline"><b>Description</b></p>
                                <button className="btn btn-sm d-inline mb-1 ms-4 px-2 translate-btn" onClick={() => setTranslatedBook(null)}>SLOVENŠČINA</button>
                                <p className="mt-2">{translatedBook.description}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}