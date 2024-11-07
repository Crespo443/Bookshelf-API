const books = require('./books');
const { nanoid } = require('nanoid');


const getBooksByReadStatus = (readStatus) => {
  const Books = books.filter((book) => book.reading === readStatus)
    .map(({ id, name, publisher }) => ({ id, name, publisher }));
  return Books;
};

const getBooksByFinishedStatus = (finishedStatus) => {
  const Books = books.filter((book) => book.finished === finishedStatus)
    .map(({ id, name, publisher }) => ({ id, name, publisher }));
  return Books;
};

const getBooksByName = (bookName) => {
  const Books = books.filter((book) => book.name.toLowerCase().includes(bookName))
    .map(({ id, name, publisher }) => ({ id, name, publisher }));
  return Books;
};


const addBookHanlder = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name){
    const response = res.response({
      status : 'fail',
      message : 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount){
    const response = res.response({
      status : 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(10);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  books.push({
    id, name, year, author, summary, publisher, pageCount,
    readPage, finished, reading, insertedAt, updatedAt
  });

  const response = res.response({
    status : 'success',
    message : 'Buku berhasil ditambahkan',
    data : {
      bookId : id
    }
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (req, res) => {
  const { reading, finished, name } = req.query;
  if (reading){
    return {
      status : 'success',
      data : {
        books : getBooksByReadStatus(Boolean(Number((reading))))
      }
    };
  } else if (finished){
    return {
      status : 'success',
      data : {
        books : getBooksByFinishedStatus(Boolean(Number(finished)))
      }
    };
  } else if (name){
    return {
      status : 'success',
      data : {
        books : getBooksByName(name.toLowerCase())
      }
    };
  }
  const allBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  return res.response({
    status : 'success',
    data : {
      books : allBooks
    }
  });
};

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((book) => book.id === bookId);

  if (!book){
    const response = res.response({
      status : 'fail',
      message : 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  const response = res.response({
    status : 'success',
    data : {
      book
    },
  });
  response.code(200);
  return response;
};

const updateBookById = (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload;

  if (!name){
    const response = res.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount){
    const response = res.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1){
    const response = res.response({
      status : 'fail',
      message : 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }
  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  };

  const response = res.response({
    status : 'success',
    message : 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;

};

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1){
    const response = res.response({
      status : 'fail',
      message : 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);
  const response = res.response({
    status : 'success',
    message : 'Buku berhasil dihapus'
  });

  response.code(200);
  return response;

};

module.exports = {
  addBookHanlder,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookById,
  deleteBookByIdHandler,
};