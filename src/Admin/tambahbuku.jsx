import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaSave } from 'react-icons/fa';
import "./index.css"; // Ensure this CSS is still relevant for any custom styles, though Tailwind is primary.

export default function TambahBuku() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '', // note: pakai id kategori, bukan nama
    description: '', // Added description to formData state for completeness
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setServerError('Token tidak ditemukan. Silakan login ulang.');
      return;
    }

    fetch('https://rem-library.up.railway.app/categories?limit=1000', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal mengambil kategori.');
        }
        return res.json();
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          setServerError(null);
        } else {
          setCategories([]);
          setServerError('Data kategori tidak valid.');
        }
      })
      .catch((err) => {
        setServerError(err.message);
        setCategories([]);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Judul harus diisi';
    if (!formData.author) newErrors.author = 'Pengarang harus diisi';
    if (!formData.categoryId) newErrors.categoryId = 'Kategori harus dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      alert('Anda harus login terlebih dahulu.');
      return;
    }

    const payload = {
      title: formData.title,
      author: formData.author,
      description: formData.description,
      categoryIds: [parseInt(formData.categoryId)],
    };

    fetch('https://rem-library.up.railway.app/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menambahkan buku.');
        }
        return res.json();
      })
      .then(() => {
        alert('Buku berhasil ditambahkan!');
        navigate('/manajemenbuku');
      })
      .catch((err) => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-[#fefae0] py-8 px-4"> {/* Changed background color */}
      <div className="container mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <Link
              to="/manajemenbuku"
              className="group flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            >
              <FaArrowLeft className="text-gray-600 group-hover:text-[#4a2515] transition-colors" /> {/* Changed hover color */}
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2D1E17] rounded-2xl flex items-center justify-center shadow-lg"> {/* Changed background color */}
                <FaBook className="text-2xl text-[#fefae0]" /> {/* Changed icon color */}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#2D1E17]"> {/* Changed text color, removed gradient */}
                  Tambah Buku Baru
                </h1>
                <p className="text-gray-600 mt-2">Tambahkan buku baru ke dalam koleksi perpustakaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Server Alert */}
        {serverError && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm"> {/* Simplified background gradient */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</h3>
                  <p className="text-red-700">{serverError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-[#4a2515] p-8"> {/* Changed background color */}
              <h2 className="text-2xl font-bold text-[#fefae0] mb-2">Informasi Buku</h2> {/* Changed text color */}
              <p className="text-[#fefae0]/80">Lengkapi form di bawah untuk menambahkan buku baru</p> {/* Changed text color */}
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Judul Buku
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none ${
                        errors.title
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                          : 'border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300' // Changed focus colors
                      }`}
                      placeholder="Masukkan judul buku yang akan ditambahkan"
                    />
                    {formData.title && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"> {/* Kept green for success */}
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.title && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.title}</span>
                    </div>
                  )}
                </div>

                {/* Author Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Pengarang
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none ${
                        errors.author
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                          : 'border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300' // Changed focus colors
                      }`}
                      placeholder="Masukkan nama pengarang buku"
                    />
                    {formData.author && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"> {/* Kept green for success */}
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.author && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.author}</span>
                    </div>
                  )}
                </div>

                {/* Description Field */}
                <div className="group">
                    <label className="block text-gray-800 font-semibold mb-3 text-lg">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300 resize-y"
                        placeholder="Masukkan deskripsi buku (opsional)"
                        rows="4"
                    ></textarea>
                </div>


                {/* Category Field */}
                <div className="group">
                  <label className="block text-gray-800 font-semibold mb-3 text-lg">
                    Kategori
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-800 text-lg transition-all duration-300 focus:outline-none appearance-none cursor-pointer ${
                        errors.categoryId
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50'
                          : 'border-gray-200 focus:border-[#4a2515] focus:ring-4 focus:ring-[#d4c6a6] hover:border-gray-300' // Changed focus colors
                      }`}
                    >
                      <option value="">Pilih kategori buku</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.categoryId && (
                    <div className="flex items-center gap-2 mt-3 text-red-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{errors.categoryId}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Link
                    to="/manajemenbuku"
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-center flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Batal</span>
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-[#4a2515] text-white rounded-2xl hover:bg-[#3e1f0d] transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaSave className="text-lg" />
                    <span>Simpan Buku</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="mt-8 bg-[#fcf7e8] rounded-2xl p-6 border border-[#d4c6a6]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4a2515] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#fefae0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#2D1E17] mb-1">Tips</h3>
                <p className="text-gray-700 text-sm">Pastikan semua field yang bertanda (*) sudah diisi dengan benar sebelum menyimpan buku.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}