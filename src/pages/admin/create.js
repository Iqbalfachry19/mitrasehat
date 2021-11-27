import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import Header from "../../components/Header";

function create() {
  const [session] = useSession();
  const router = useRouter();
  return (
    <>
      {!session ? (
        <div>
          <Header />
          <div className="flex justify-center items-center">not-allowed</div>
        </div>
      ) : (
        <div>
          <Header />
          <div>
            <div onClick={() => router.push("/admin/create")}>
              <p>Tambah Produk</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default create;
