import axios from "axios";

export const CreateNewProduct = async (product, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/product`;
  const headers = { authtoken };
  return await axios.post(url, product, { headers });
};

export const GetAllProducts = async () => {
  const url = `${import.meta.env.VITE_APP_API}/products`;
  return await axios.get(url);
};

export const GetSingleProduct = async (slug) => {
  const url = `${import.meta.env.VITE_APP_API}/product/${slug}`;
  return await axios.get(url);
};

export const UpdateSingleProduct = async (slug, product, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/product/${slug}`;
  const headers = { authtoken };
  return await axios.put(url, product, { headers });
};

export const DeleteProduct = async (slug, authtoken) => {
  const url = `${import.meta.env.VITE_APP_API}/product/${slug}`;
  const headers = { authtoken };
  return await axios.delete(url, { headers });
};

export const GetRelatedProduct = async (slug) => {
  const url = `${import.meta.env.VITE_APP_API}/product/related/${slug}`;
  return await axios.get(url);
};
