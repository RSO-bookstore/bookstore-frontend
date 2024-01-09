import { useQuery, gql } from "@apollo/client";

export default function BookList({ setSelectedBook, setPage }) {
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
    const { loading, error, data } = useQuery(GET_BOOKS_QUERY);

    if (loading) {
        return(
            <div className="container mt-4">
                <div className="row">
                    <p className="font-24 bold orange">Books in the store</p>
                </div>
                <div className="row">
                    <div className="col d-flex align-items-center justify-content-center">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }
    if (error) {
        return(
            <div className="container mt-4">
                <div className="row">
                    <p className="font-24 bold orange">Books in the store</p>
                </div>
                <div className="row">
                    <div className="col d-flex align-items-center justify-content-center">
                        <p>Error: {error.message}</p>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="container my-4">
            <div className="row">
                <p className="font-24 bold orange">Books in the store</p>
            </div>
            {data.books.map(book => {
                if (book.stockQuantity == 0){
                    return
                }
                return (
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between px-5 mx-2 mt-3 listing pt-3" onClick={(e) => {setSelectedBook(book.id); setPage('book')}}>
                            <p className="d-inline">#{book.id}</p>
                            <p className="d-inline"><b>{book.title}</b></p>
                            <p className="d-inline">{book.author}</p>
                            <p className="d-inline">{book.price} €</p>
                            <p className="d-inline">{book.stockQuantity} left</p>
                        </div>
                    </div>
                )
            })
            }
        </div>
    )
}