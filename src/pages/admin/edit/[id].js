import { getSession, useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import db from "../../../../firebase";
function edit({ session }) {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState(0);
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState("");
  const [kategori, setKategori] = useState("");
  const { id } = router.query;
  const editProduk = () => {
    db.collection("products")
      .doc(id)
      .update({
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
  useEffect(
    () =>
      db
        .collection("products")
        .doc(id)
        .onSnapshot((doc) => {
          setNama(doc.data()?.title);
          setHarga(doc.data()?.price);
          setDeskripsi(doc.data()?.description);
          setGambar(doc.data()?.image);
          setKategori(doc.data()?.category);
        }),
    [db, id]
  );

  return (
    <>
      {!session ? (
        <div className=" h-screen overflow-y-hidden">
          <Head>
            <title>RTD Mitra Sehat | Edit Produk</title>
          </Head>
          <Header />
          <div className="flex justify-center h-screen items-center">
            not-allowed
          </div>
        </div>
      ) : (
        <div>
          <Head>
            <title>RTD Mitra Sehat | Edit Produk</title>
          </Head>
          <Header />
          <div className="flex ">
            <Sidebar />
            <div className="flex flex-col justify-center mx-4 my-1 w-screen ">
              <h1 className="text-xl border-b mb-2 pb-1 border-yellow-400">
                Edit Produk
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
                      value={nama}
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
                      value={harga}
                      type="text"
                      placeholder="Harga Produk"
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
                      value={kategori}
                      placeholder="Kategori produk"
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
                      value={deskripsi}
                      placeholder="Deskripsi produk"
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
                      value={gambar}
                      placeholder="Url gambar"
                    />
                  </div>
                  <div class="flex items-center justify-between">
                    <button
                      onClick={() => editProduk(id)}
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                    >
                      Ubah
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

export default edit;
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
