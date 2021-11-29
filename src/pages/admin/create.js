import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import db from "../../../firebase";

function create({ session }) {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState(0);
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [kategori, setKategori] = useState("");
  const router = useRouter();
  const addProduct = () => {
    db.collection("products")
      .add({
        title: nama,
        price: harga,
        description: deskripsi,
        image: gambar,
        category: kategori,
      })
      .then((docRef) => {
        router.push("/admin/dashboard");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <>
      {!session ? (
        <div className=" h-screen overflow-y-hidden">
          <Head>
            <title>RTD Mitra Sehat | Tambah Produk</title>
          </Head>
          <Header />
          <div className="flex justify-center h-screen items-center">
            not-allowed
          </div>
        </div>
      ) : (
        <div>
          <Head>
            <title>RTD Mitra Sehat | Tambah Produk</title>
          </Head>
          <Header />
          <div className="flex ">
            <Sidebar />
            <div className="flex flex-col justify-center mx-4 my-1 w-screen ">
              <h1 className="text-xl border-b mb-2 pb-1 border-yellow-400">
                Tambah Produk
              </h1>
              <div class="w-full ">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="username"
                    >
                      Nama Produk
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Nama Produk"
                      onChange={(e) => setNama(e.target.value)}
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="password"
                    >
                      Harga Produk
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Harga Produk"
                      onChange={(e) => setHarga(e.target.value)}
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="password"
                    >
                      Kategori Produk
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Kategori produk"
                      onChange={(e) => setKategori(e.target.value)}
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="password"
                    >
                      Deskripsi Produk
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Deskripsi produk"
                      onChange={(e) => setDeskripsi(e.target.value)}
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="password"
                    >
                      Gambar Produk
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Url gambar"
                      onChange={(e) => setGambar(e.target.value)}
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      onClick={addProduct}
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                    >
                      Tambah
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default create;
export async function getServerSideProps(context) {
  const session = await getSession(context);

  const admins = await db
    .collection("users")

    .where("isAdmin", "==", true)
    .get();
  const admin = await Promise.all(
    admins.docs.map(async (product) => ({
      id: product.id,
      isAdmin: product.data().isAdmin,
    }))
  ).catch((error) => {
    console.log(error);
  });

  if (session?.user?.email == admin[0].id) {
    return {
      props: {
        session: session,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
