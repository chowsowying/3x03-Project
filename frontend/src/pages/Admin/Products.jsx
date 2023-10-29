import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GetAllProducts, DeleteProduct } from "../../api/productAPI";
import { AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";

const Products = () => {
  // State
  const [products, setProducts] = useState([]);

  //Variables
  const { user } = useSelector((state) => state.user);

  //Function: Get All Products
  const fetchProducts = async () => {
    try {
      const response = await GetAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Function: Delete Product
  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await DeleteProduct(slug, user.token);
        toast.success(response.data.message);
        fetchProducts();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  // UseEffect: Fetch All Products
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="bg-custom p-4 overflow-auto admin-container-height">
          <div className="card shadow border-0 mb-7 p-3">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5>All Products</h5>
                <a href="/admin/create-product" className="btn btn-primary">
                  <AiOutlinePlus className="mb-1" />
                </a>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-nowrap">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].url
                              : "https://via.placeholder.com/200x200.png?text=Product+Image"
                          }
                          className="card-img-top object-fit-cover"
                          height="50"
                          width="50"
                        />
                      </td>
                      <td>{product.title}</td>
                      <td>{product.description.substring(0, 100)}</td>
                      <td>${product.price}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <a
                            href={`/admin/update-product/${product.slug}`}
                            className="btn btn-success">
                            <AiFillEdit className="mb-1" />
                          </a>
                          <a onClick={() => handleDelete(product.slug)} className="btn btn-danger">
                            <AiFillDelete className="mb-1" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;

//  {/* Product Card */}
//  {products &&
//   products.map((product) => (
//     <Col lg={3} md={6} className="mb-4">
//       <div className="card" key={product._id}>
//         <img
//           src={
//             product.images && product.images.length > 0
//               ? product.images[0].url
//               : "https://via.placeholder.com/200x200.png?text=Product+Image"
//           }
//           className="card-img-top"
//           height="200"
//           width="200"
//         />
//         <div className="card-body">
//           <h5 className="card-title">{product.title}</h5>
//           <p className="card-text">{product.description.substring(0, 100)}</p>
//           <p className="card-text">${product.price}</p>
//           <div className="d-flex gap-2">
//             <a
//               href={`/admin/update-product/${product.slug}`}
//               className="btn btn-primary">
//               Edit
//             </a>
//             <a onClick={() => handleDelete(product.slug)} className="btn btn-danger">
//               Delete
//             </a>
//           </div>
//         </div>
//       </div>
//     </Col>
//   ))}
