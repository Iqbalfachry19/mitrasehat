import dynamic from "next/dynamic";
const Product = dynamic(() => import("./Product"), { ssr: false });

function ProductFeed({ products }) {
  return (
    <>
      {products.length === 0 ? (
        <div className="grid  xl:grid-cols-1 md:-mt-52 mx-auto">
          <div className="flex justify-center m-5 bg-white z-30 p-10">
            <h1 className="my-3">No Product Found</h1>
          </div>
        </div>
      ) : (
        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
          {products
            .slice(0, 4)
            .map(({ id, title, price, description, category, image }) => (
              <Product
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                image={image}
              />
            ))}
          <img
            className="md:col-span-full"
            src="https://links.papareact.com/dyz"
            alt=""
          />
          <div className="md:col-span-2">
            {products
              .slice(4, 5)
              .map(({ id, title, price, description, category, image }) => (
                <Product
                  key={id}
                  id={id}
                  title={title}
                  price={price}
                  description={description}
                  category={category}
                  image={image}
                />
              ))}
          </div>
          {products
            .slice(5, products.length)
            .map(({ id, title, price, description, category, image }) => (
              <Product
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                image={image}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default ProductFeed;