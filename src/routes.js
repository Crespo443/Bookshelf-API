const {
  addBookHanlder,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookById,
  deleteBookByIdHandler
} = require('./handler');

const routes = [
  {
    method : 'POST',
    path   : '/books',
    handler : addBookHanlder,
  },

  {
    method : 'GET',
    path   : '/books',
    handler : getAllBooksHandler
  },

  {
    method : 'GET',
    path   : '/books/{bookId}',
    handler : getBookByIdHandler
  },

  {
    method : 'PUT',
    path   : '/books/{bookId}',
    handler : updateBookById
  },

  {
    method : 'DELETE',
    path   : '/books/{bookId}',
    handler : deleteBookByIdHandler
  },

];

module.exports = routes;