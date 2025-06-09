import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManajemenBuku = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `https://rem-library.up.railway.app/books?page=${page}&limit=10`;

      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data.data)) {
        throw new Error('Books data is not an array');
      }

      setBooks(data.data);
      setTotalPages(data.meta?.totalPages || 1);
      setError('');
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Gagal memuat data buku.');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        'https://rem-library.up.railway.app/categories?page=1&limit=100',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!Array.isArray(data.data)) {
        throw new Error('Categories data is not an array');
      }

      setCategories(data.data);
      setError('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Gagal memuat kategori.');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleResetFilter = () => {
    setSelectedCategory('');
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah kamu yakin ingin menghapus buku ini?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://rem-library.up.railway.app/books/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Gagal menghapus buku');
      }

      fetchBooks();
      alert('Buku berhasil dihapus');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Gagal menghapus buku');
    }
  };

  return (
    <div className="min-h-screen bg-[#fefae0]"> {/* Changed background color */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#2D1E17] rounded-2xl flex items-center justify-center shadow-lg"> {/* Changed background color */}
              <span className="text-2xl text-[#fefae0]">📚</span> {/* Changed text color */}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#2D1E17]"> {/* Changed text color, removed gradient */}
                Manajemen Buku
              </h1>
              <p className="text-gray-600 mt-2">Kelola koleksi buku perpustakaan digital Anda</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Control Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* Add Book Button */}
            <button
              onClick={() => navigate('/books/add')}
              className="group relative px-8 py-4 bg-[#4a2515] text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold" // Changed background color
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">+</span>
                </div>
                <span>Tambah Buku Baru</span>
              </div>
              {/* Removed absolute gradient div as per request for no degradation */}
            </button>

            {/* Filter Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="appearance-none bg-white border-2 border-gray-200 rounded-2xl px-6 py-3 pr-12 text-gray-700 font-medium focus:outline-none focus:border-[#4a2515] focus:ring-4 focus:ring-[#fefae0] transition-all cursor-pointer shadow-sm hover:shadow-md" // Changed focus colors
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleResetFilter}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span className="text-lg"></span>
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {books.map((book) => (
            <div
              key={book.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
            >
              {/* Card Header */}
              <div className="h-2 bg-[#4a2515]"></div> {/* Changed background color */}
              
              {/* Card Content */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#fefae0] rounded-2xl flex items-center justify-center"> {/* Changed background color */}
                      <span className="text-xl">📖</span>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#4a2515] transition-colors line-clamp-2"> {/* Changed hover text color */}
                    {book.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-[#fefae0] rounded-full flex items-center justify-center"> {/* Changed background color */}
                      <span className="text-[#4a2515] text-xs">👤</span> {/* Changed text color */}
                    </div>
                    <p className="text-sm font-medium text-[#2D1E17]">{book.author}</p> {/* Changed text color */}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/books/edit/${book.id}`)}
                    className="flex-1 py-3 bg-[#6a9955] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2" // Adjusted to a harmonious green
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 py-3 bg-[#a54c30] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2" // Adjusted to a harmonious red/orange
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <button
              onClick={() => page > 1 && setPage((p) => p - 1)}
              disabled={page === 1}
              className="group px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Halaman Sebelumnya</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="bg-[#4a2515] text-white px-6 py-3 rounded-2xl shadow-lg"> {/* Changed background color */}
                <span className="font-bold text-lg">{page}</span>
              </div>
              <span className="text-gray-500 font-medium">dari</span>
              <div className="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl shadow-sm">
                <span className="font-bold text-lg">{totalPages}</span>
              </div>
            </div>
            
            <button
              onClick={() => page < totalPages && setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="group px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
            >
              <span>Halaman Selanjutnya</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManajemenBuku;