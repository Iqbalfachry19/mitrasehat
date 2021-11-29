import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import db from "../../../firebase";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
function dashboard({ session }) {
  const [products, setProducts] = useState([]);
  const deleteProduct = (id) => {
    db.collection("products")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  useEffect(
    () =>
      db
        .collection("products")

        .onSnapshot((doc) => {
          const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

          setProducts(data);
        }),
    [db]
  );

  const router = useRouter();
  return (
    <>
      {!session ? (
        <div>
          <Head>
            <title>RTD Mitra Sehat | Admin dashboard</title>
          </Head>
          <Header />
          <div className="flex justify-center h-screen items-center">
            not-allowed
          </div>
        </div>
      ) : (
        <div>
          <Head>
            <title>RTD Mitra Sehat | Admin dashboard</title>
          </Head>
          <Header />
          <div className="flex ">
            <Sidebar />
            <div className="flex flex-col justify-center mx-4 my-1   w-screen ">
              <h1 className="text-xl border-b mb-2 pb-1 border-yellow-400 ">
                Halaman admin
              </h1>
              <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                  <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Nama Produk
                    </th>
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Harga Produk
                    </th>
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Kategori Produk
                    </th>
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Deskripsi Produk
                    </th>
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Gambar Produk
                    </th>
                    <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="bg-gray-300 border border-grey-500 md:border-none block md:table-row"
                    >
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Nama Produk
                        </span>
                        {product.title}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Harga Produk
                        </span>
                        {product.price}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Kategori Produk
                        </span>
                        {product.category}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Deskripsi Produk
                        </span>
                        {product.description}
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Gambar Produk
                        </span>
                        <img className="h-10 w-10" src={product.image}></img>
                      </td>
                      <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Actions
                        </span>
                        <button
                          onClick={() =>
                            router.push(`/admin/edit/${product.id}`)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default dashboard;

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
