import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import { HeaderManajemenPembayaran } from "../components/HeaderAdmin";

const ManajemenPembayaran = ({ showHeader = true, showSidebar = true }) => {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/payments"
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };
    fetchPayments();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex h-screen">
      {showSidebar && <SidebarAdmin />}
      <div className="flex-grow flex flex-col">
        {showHeader && (
          <div className="flex justify-between items-center p-0 bg-white">
            <HeaderManajemenPembayaran />
          </div>
        )}

        <div className="w-full max-w-full rounded-lg p-5">
          <div className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-emerald-500">
                <thead className="bg-white">
                  <tr className="text-gray-600">
                    <th
                      colSpan="6"
                      className="p-3 border border-emerald-500 text-left text-xl font-semibold text-gray-900"
                    >
                      Daftar Pembayaran
                    </th>
                  </tr>
                  <tr className="text-gray-800 border-b border-emerald-500">
                    <th className="p-3 text-left bg-white">Nomor</th>
                    <th className="p-3 text-left bg-white">Tanggal</th>
                    <th className="p-3 text-left bg-white">Pengguna</th>
                    <th className="p-3 text-left bg-white">Pembayaran</th>
                    <th className="p-3 text-left bg-white">Total</th>
                    <th className="p-3 text-left bg-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white text-gray-800 border-b border-emerald-500"
                    >
                      <td className="p-3 text-left">
                        {item.transaction_id || "Tidak tersedia"}
                      </td>
                      <td className="p-3 text-left whitespace-nowrap">
                        <span className="bg-emerald-100 text-gray-800 px-3 py-1 rounded-md font-semibold">
                          {new Date(item.createdAt).toLocaleDateString()}{" "}
                        </span>
                      </td>
                      <td className="p-3 text-left">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              item.user?.foto ||
                              "https://via.placeholder.com/40"
                            }
                            alt="Foto Pengguna"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.user?.nama || "Nama tidak tersedia"}
                            </p>
                            <p className="text-gray-700">
                              {item.user?.email || "Email tidak tersedia"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-left">
                        <span className="font-semibold text-gray-700">
                          {item.metode_pembayaran || "Tidak tersedia"}
                        </span>
                      </td>
                      <td className="p-3 text-left">
                        <span className="text-gray-800 px-3 py-1 rounded-md">
                          Rp. {item.jumlah_bayar || "Tidak tersedia"}
                        </span>
                      </td>
                      <td className="p-3 text-left">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            item.status_pembayaran === "completed"
                              ? "bg-emerald-500 text-slate-50"
                              : item.status_pembayaran === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.status_pembayaran || "Tidak tersedia"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6" className="p-3">
                      <div className="flex justify-end items-center space-x-2">
                        {Array.from(
                          { length: Math.ceil(payments.length / itemsPerPage) },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            className={`w-8 h-8 ${
                              currentPage === page
                                ? "bg-emerald-700"
                                : "bg-emerald-500"
                            } text-white rounded-full`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManajemenPembayaran;
