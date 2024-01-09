import './App.css';
import BookList from './BookList';
import BookInfo from './BookInfo';
import { useEffect, useState } from 'react';
import Cart from './Cart';
import Admin from './Admin';

function App() {
    
    const [page, setPage] = useState('books');
    const [selectedBook, setSelectedBook] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
      let u = localStorage.getItem('users').split(`,`).map(x => parseInt(x, 10));
      if (JSON.stringify(users) !== JSON.stringify(u)){
        setUsers(u);
      }
    }, [users]);

    const createNewUser = () => {
        let newUserID = Math.floor(Math.random() * (1000 - 0 + 1) + 0);
        setCurrentUser(newUserID);
        setUsers([...users, newUserID]);
        localStorage.setItem('users', [...users, newUserID]);
    }

    return(
        <div className=''>
            <nav class="navbar bg-orange">
                <div class="container">
                    <a class="navbar-brand white bold no-decoration" onClick={() => setPage('books')}>Amazunga</a>
                    <div className=''>
                        <div class="dropdown d-inline me-3">
                            <a class="btn-sm dropdown-toggle white no-decoration bold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              {'User: ' + currentUser}
                            </a>

                            <ul class="dropdown-menu">
                                {users.map(user => {
                                    return (
                                        <li><a class="dropdown-item" onClick={() => {setCurrentUser(user); setPage('books')}}>{user}</a></li>
                                    )
                                })}
                            </ul>
                        </div>
                        <a class='bold no-decoration ms-auto me-3 white' onClick={() => createNewUser()}>New User</a>
                        <a class={page === 'admin' ? 'bold no-decoration ms-auto me-3 white nav-active' : 'bold no-decoration ms-auto me-3 white'} onClick={() => setPage('admin')}>Admin</a>
                        <a class={page === 'books' ? 'bold no-decoration ms-auto me-3 white nav-active' : 'bold no-decoration ms-auto me-3 white'} onClick={() => setPage('books')}>Books</a>
                        <a class={page === 'cart' ? 'bold no-decoration ms-auto white nav-active' : 'bold no-decoration ms-auto white'} onClick={() => setPage('cart')}>Cart</a>
                    </div>
                </div>
            </nav>
            {(page == 'books' || page == 'book') && 
                <div className='container'>
                    <div className='hero d-flex align-items-end'>
                        <p className='lead-text white bold ms-5 mb-5 pb-3 font-32 text-shadow'>#1 BOOKSTORE ON THE WEB</p>
                    </div>    
                </div>
            }
            {page == 'books' &&
                <BookList
                    setSelectedBook={setSelectedBook}
                    setPage={setPage}
                />
            }
            {page == 'book' &&
                <BookInfo
                    bookID={selectedBook}
                    user={currentUser}
                />
            }
            {(page === 'cart' && currentUser !== null) &&
              <Cart
                  user={currentUser}
              />
            }
            {page == 'admin' &&
                <Admin/>
            }
            <footer className="bg-body-tertiary text-center text-lg-start mt-5">
              <div className="text-center p-3 bg-orange">
                <p className='white pt-2'>Author: <a className="ms-2 no-decoration white" href="https://github.com/kkeroo" target='_blank'>Jaša Kerec</a> | Cloud-native application developed during course Cloud Computing @ FRI</p>
              </div>
            </footer>
        </div>
    )
}

export default App;
