import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBuku() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [judul, setJudul] = useState('');
  const [pengarang, setPengarang] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState([]); // semua kategori dari server
  const [kategoriDipilih, setKategoriDipilih] = useState([]); // id kategori yang dipilih buku ini

  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch semua kategori
  useEffect(() => {
    if (!token) {
      setServerError('Token tidak ditemukan. Silakan login ulang.');
      return;
    }
    fetch('https://rem-library.up.railway.app/categories?limit=1000', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal mengambil kategori.');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          setKategori(data.data);
          setServerError(null);
        } else {
          setServerError('Data kategori tidak valid.');
        }
      })
      .catch((err) => {
        setServerError(err.message);
      });
  }, [token]);

  // Fetch data buku by id
  useEffect(() => {
    if (!token) {
      setServerError('Token tidak ditemukan. Silakan login ulang.');
      return;
    }
    fetch(`https://rem-library.up.railway.app/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal mengambil data buku.');
        }
        return res.json();
      })
      .then((data) => {
        setJudul(data.title || '');
        setPengarang(data.author || '');
        setDeskripsi(data.description || '');
        // data.categories diasumsikan array kategori objek, kita ambil id nya
        setKategoriDipilih(data.categories ? data.categories.map((c) => c.id) : []);
        setServerError(null);
        setLoading(false);
      })
      .catch((err) => {
        setServerError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  // Handler perubahan pilihan kategori
  const handleKategoriChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setKategoriDipilih((prev) => [...prev, value]);
    } else {
      setKategoriDipilih((prev) => prev.filter((id) => id !== value));
    }
  };

  // Submit update buku
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judul.trim() || !pengarang.trim() || kategoriDipilih.length === 0) {
      setServerError('Judul, pengarang, dan kategori harus diisi.');
      return;
    }
    setServerError(null);

    fetch(`https://rem-library.up.railway.app/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: judul,
        author: pengarang,
        description: deskripsi,
        categoryIds: kategoriDipilih, // sesuaikan dengan backend (misal: categoryIds atau categories)
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal memperbarui buku.');
        }
        return res.json();
      })
      .then(() => {
        alert('Buku berhasil diperbarui.');
        navigate('/manajemenbuku'); // ganti sesuai route daftar buku
      })
      .catch((err) => {
        setServerError(err.message);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefae0] flex items-center justify-center"> {/* Changed background color */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4a2515] border-t-transparent mx-auto mb-4"></div> {/* Changed spinner color */}
          <p className="text-gray-600 font-medium">Loading data buku...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefae0] py-8 px-4"> {/* Changed background color */}
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2D1E17] mb-2"> {/* Changed text color, removed gradient */}
            Edit Buku
          </h1>
          <p className="text-gray-600">Perbarui informasi buku Anda</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#4a2515] h-2"></div> {/* Changed background color */}
          
          <div className="p-8">
            {/* Error Alert */}
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl"> {/* Simplified background gradient */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-700 font-medium">{serverError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Judul Buku */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="judul">
                  Judul Buku <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="judul"
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#4a2515]/20 focus:border-[#4a2515] transition-all duration-200 font-medium text-gray-900" // Changed focus colors
                    placeholder="Masukkan judul buku"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pengarang */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="pengarang">
                  Pengarang <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="pengarang"
                    type="text"
                    value={pengarang}
                    onChange={(e) => setPengarang(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#4a2515]/20 focus:border-[#4a2515] transition-all duration-200 font-medium text-gray-900" // Changed focus colors
                    placeholder="Masukkan nama pengarang"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="deskripsi">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-[#4a2515]/20 focus:border-[#4a2515] transition-all duration-200 resize-none font-medium text-gray-900" // Changed focus colors
                  rows={4}
                  placeholder="Masukkan deskripsi buku (opsional)"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
                  {kategori.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse flex justify-center items-center space-x-2">
                        <div className="h-2 w-2 bg-[#4a2515] rounded-full animate-bounce"></div> {/* Changed color */}
                        <div className="h-2 w-2 bg-[#4a2515] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div> {/* Changed color */}
                        <div className="h-2 w-2 bg-[#4a2515] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div> {/* Changed color */}
                      </div>
                      <p className="text-gray-500 mt-2">Memuat kategori...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {kategori.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-150">
                          <input
                            type="checkbox"
                            id={`cat-${cat.id}`}
                            value={cat.id}
                            checked={kategoriDipilih.includes(cat.id)}
                            onChange={handleKategoriChange}
                            className="h-4 w-4 text-[#4a2515] focus:ring-[#4a2515] border-gray-300 rounded transition-colors duration-150" // Changed checkbox colors
                          />
                          <label 
                            htmlFor={`cat-${cat.id}`} 
                            className="text-sm font-medium text-gray-700 cursor-pointer select-none flex-1"
                          >
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {kategoriDipilih.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {kategoriDipilih.map((id) => {
                      const cat = kategori.find(c => c.id === id);
                      return cat ? (
                        <span key={id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#d4c6a6] text-[#2D1E17]"> {/* Changed badge colors */}
                          {cat.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/manajemenbuku')}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 focus:outline-none focus:ring-3 focus:ring-gray-500/20 transition-all duration-200 order-2 sm:order-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#4a2515] text-white rounded-xl font-semibold hover:bg-[#3e1f0d] focus:outline-none focus:ring-3 focus:ring-[#4a2515]/20 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl order-1 sm:order-2" // Changed button background and hover colors
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}