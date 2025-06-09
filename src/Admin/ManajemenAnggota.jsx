import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaUsers, FaPlus } from 'react-icons/fa';

const ManajemenAnggota = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const membersPerPage = 10;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://rem-library.up.railway.app/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMembers(data.data || []);
        } else {
          setError(data.message || 'Gagal mengambil data anggota.');
        }
      } catch (err) {
        setError('Gagal mengambil data anggota.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Yakin ingin menghapus anggota ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://rem-library.up.railway.app/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal menghapus anggota.');
      }

      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.username?.toLowerCase().includes(searchTerm) ||
    member.email?.toLowerCase().includes(searchTerm) ||
    member.role?.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredMembers]);

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  return (
    <div className="min-h-screen bg-[#fefae0]"> {/* Changed background to match profile */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-[#2D1E17] p-3 rounded-xl"> {/* Changed icon background to dark brown */}
                <FaUsers className="text-[#fefae0] text-xl" /> {/* Changed icon color to light accent */}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2D1E17]">Manajemen Anggota</h1> {/* Changed text color to dark brown */}
                <p className="text-gray-500 text-sm mt-1">
                  Kelola data anggota perpustakaan
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Anggota</div>
              <div className="text-2xl font-bold text-[#2D1E17]">{members.length}</div> {/* Changed text color to dark brown */}
            </div>
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau role..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a2515]/20 focus:border-[#4a2515] transition-all duration-200" // Changed focus ring/border to brown
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Link
              to="/members/add"
              className="flex items-center space-x-2 bg-[#4a2515] text-white px-6 py-3 rounded-xl hover:bg-[#3e1f0d] focus:outline-none focus:ring-2 focus:ring-[#4a2515]/20 transition-all duration-200 font-medium shadow-sm" // Changed button background and hover to brown tones
            >
              <FaPlus className="text-sm" />
              <span>Tambah Anggota</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4a2515] border-t-transparent mb-4"></div> {/* Changed spinner color */}
              <p className="text-gray-500">Memuat data anggota...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-red-50 p-4 rounded-xl mb-4">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentMembers.length > 0 ? (
                      currentMembers.map((member, index) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-[#d4c6a6] flex items-center justify-center text-[#2D1E17] font-semibold"> {/* Changed avatar background and text color */}
                                  {member.username?.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              member.role === 'admin' 
                                ? 'bg-[#2D1E17]/20 text-[#2D1E17]' // Admin role using dark brown with transparency
                                : 'bg-[#d4c6a6] text-[#2D1E17]' // User role using lighter brown accent
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/members/edit/${member.id}`}
                                className="p-2 text-[#4a2515] hover:text-[#3e1f0d] hover:bg-[#fefae0] rounded-lg transition-all duration-200" // Changed link colors to brown
                                title="Edit anggota"
                              >
                                <FaEdit className="text-sm" />
                              </Link>
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Hapus anggota"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-16 text-center" colSpan={4}>
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-100 p-4 rounded-xl mb-4">
                              <FaUsers className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada data anggota ditemukan</p>
                            <p className="text-gray-400 text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Menampilkan {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, filteredMembers.length)} dari {filteredMembers.length} anggota
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Sebelumnya
                      </button>
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                currentPage === pageNum
                                  ? 'bg-[#4a2515] text-white shadow-sm' // Active page button using brown
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManajemenAnggota;