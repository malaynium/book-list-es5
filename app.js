// Book Consructor
function Book(title,author,isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

// UI Constructor
function UI(){}

// Add book to list
UI.prototype.addBookToList = function(book){
  const list = document.getElementById('book-list');
  // create tr element
  const row = document.createElement('tr');
  // Insert cols
  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;
   
  list.appendChild(row);
}

// show alert
UI.prototype.showAlert = function(message, className) {
  // create div
  const div = document.createElement('div');
  // add classes
  div.className = `alert ${className}`;
  // add text
  div.appendChild(document.createTextNode(message));
  // get parent
  const container = document.querySelector('.container');
  // get form
  const form = document.querySelector('#book-form');
  // insert alert
  container.insertBefore(div, form);

  // Timeout after 3 sec
  setTimeout(function(){
    document.querySelector('.alert').remove();}, 3000);

}

// delete book 
UI.prototype.deleteBook = function(target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
}

// clear field
UI.prototype.clearFields = function(){
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
}

// Local Storage Constructor
function Store(){}

Store.prototype.getBooks = function(){

  let books;
  if (localStorage.getItem('books')=== null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }
  return books;

}

Store.prototype.addBook = function(book){
  
  // instant Store
  const store = new Store;

  const books = store.getBooks();

  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));

}

Store.prototype.displayBooks = function() {

  const store = new Store;

  const books = store.getBooks();
    
  books.forEach(function(book){
    const ui = new UI;

    // add book to UI
    ui.addBookToList(book);

  });

}

Store.prototype.removeBook = function(isbn) {
  const store = new Store;

  const books = store.getBooks();

  books.forEach(function(book, index){
    if(book.isbn === isbn) {
      books.splice(index, 1);
    }

  });

  localStorage.setItem('books', JSON.stringify(books));

}


// DOM load event
const store = new Store;

document.addEventListener('DOMContentLoaded', store.displayBooks);


// Event Listener
document.getElementById('book-form').addEventListener('submit', function(e){
  
  // get Form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  // instant book constructor
  const book = new Book(title,author,isbn);

  // instant UI
  const ui = new UI;

  // instant Store
  const store = new Store;

  // validate
  if (title === '' || author === '' || isbn === ''){
    // error alert
    ui.showAlert('Please fill in all field', 'error');
  } else {
    // add book to list
    ui.addBookToList(book);

    // add to ls
    store.addBook(book);

    // show success
    ui.showAlert('Book Added!', 'success');

    // clear fields
    ui.clearFields();

  }

  e.preventDefault();
});

// event listener for delete
document.getElementById('book-list').addEventListener
('click', function(e){

  // instan UI
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);

  // instant store
  const store = new Store();
  // remove from ls
  store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
});