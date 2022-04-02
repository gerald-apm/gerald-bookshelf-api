/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const bookshelf = require('./books');

const addBookHandler = (request, h) => {
    // tambahkan properti penyimpan books
    try {
        const {name, year, author, summary, publisher,
            pageCount, readPage, reading} = request.payload;
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = (pageCount === readPage);

        const newBook = {
            id, name, year, author, summary, publisher,
            pageCount, readPage, finished, reading, insertedAt, updatedAt,
        };

        if (!(pageCount >= readPage)) {
            throw SyntaxError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
        } else if (!name) {
            throw SyntaxError('Gagal menambahkan buku. Mohon isi nama buku');
        }

        bookshelf.push(newBook);
        // cek kesuksesan notes
        const isSuccess = (bookshelf.filter((bo) => bo.id === id).length > 0);

        // posting pesan jika sukses!
        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(400);
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;
    let booklist;
    const mapBool = (status) => {
        return status === '1';
    };

    // seleksi alam berdasarkan query
    if (name !== undefined) {
        booklist = bookshelf.filter((b) => b.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 );
    } else if (reading !== undefined) {
        booklist = bookshelf.filter((b) => b.reading == mapBool(reading));
    } else if (finished !== undefined) {
        booklist = bookshelf.filter((b) => b.finished == mapBool(finished));
    } else {
        booklist = bookshelf;
    }

    // hanya tampilkan tiga parameter
    const books = booklist.map((bo) => {
        return {
            id: bo.id,
            name: bo.name,
            publisher: bo.publisher,
        };
    });

    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;
    const book = bookshelf.filter((bo) => bo.id === id)[0];
    if ((id !== undefined) && (book !== undefined)) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
};

const editBookByIdHandler = (request, h) => {
    try {
        const {id} = request.params;
        const {name, year, author, summary,
            publisher, pageCount, readPage, reading} = request.payload;
        const insertedAt = new Date().toISOString();
        const index = bookshelf.findIndex((n) => n.id === id);

        if (index === -1) {
            throw Error('Gagal memperbarui buku. Id tidak ditemukan');
        } else if (!name) {
            throw Error('Gagal memperbarui buku. Mohon isi nama buku');
        } else if (!(pageCount >= readPage)) {
            throw Error('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
        }

        bookshelf[index] = {
            ...bookshelf[index],
            name, year, author, summary,
            publisher, pageCount, readPage, reading, insertedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        if (error.message === 'Gagal memperbarui buku. Id tidak ditemukan') {
            response.code(404);
        } else {
            response.code(400);
        }
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    try {
        const {id} = request.params;
        const index = bookshelf.findIndex((n) => n.id === id);
        if (index === -1) {
            throw Error('Buku gagal dihapus. Id tidak ditemukan');
        }
        bookshelf.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(404);
        return response;
    }
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler};
