import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GetSingleProduct, UpdateSingleProduct } from "../../api/productAPI";
import { setLoading } from "../../redux/loaderSlice";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const cloud_name = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;

const UpdateProduct = () => {
  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [images, setImages] = useState([]);
  const [condition, setCondition] = useState("");

  const values = {
    title,
    description,
    price,
    category,
    quantity,
    images,
    condition,
  };

  // Declare variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useSelector((state) => state.user);

  //Function: Get Single Product
  const fetchProduct = async () => {
    try {
      const response = await GetSingleProduct(slug);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setPrice(response.data.price);
      setCategory(response.data.category);
      setQuantity(response.data.quantity);
      setImages(response.data.images);
      setCondition(response.data.condition);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  //Function: Create Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await UpdateSingleProduct(slug, values, user.token);
      dispatch(setLoading(false));
      toast.success(response.data.message);
      navigate("/admin/products");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

  //Function: Upload Image
  const handleImageUpload = (ev) => {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    let files = ev.target.files;
    let allUploadedFiles = values.images;
    // Resize Images
    if (files) {
      dispatch(setLoading(true));
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        //Does not allow multiple extension
        if (file.name.split(".").length > 2) {
          console.error("File with multiple extensions not allowed");
          toast.error("File with multiple extensions not allowed");
          continue;
        }
        //Extension not .png, .jpg or .jpeg
        if (!allowedExtensions.includes(fileExtension)) {
          console.error("Invalid file extension");
          toast.error("Invalid file extension");
          continue;
        }
        //File size must be below 10MB
        if (file.size > maxFileSize) {
          console.error("File size too large");
          toast.error("File size too large");
          continue;
        }

        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log("Base64 image:", uri); // Add this line
            let formData = new FormData();
            formData.append("upload_preset", upload_preset);
            formData.append("file", uri);
            axios
              .post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData)
              .then((res) => {
                dispatch(setLoading(false));
                console.log("IMAGE UPLOAD RES DATA", res);
                if (
                  res.data.public_id &&
                  res.data.secure_url &&
                  res.data.secure_url.includes(res.data.public_id)
                ) {
                  allUploadedFiles.push({
                    public_id: res.data.public_id,
                    url: res.data.secure_url,
                  });
                  setImages(allUploadedFiles);
                  toast.success("Image Uploaded");
                }
              })
              .catch((err) => {
                dispatch(setLoading(false));
                console.log("CLOUDINARY UPLOAD ERR", err);
                console.log(err.response.data);
                toast.error(err.response.data.message);
              });
          },
          "base64"
        );
      }
    }
  };

  //Function: Handle Remove Image
  const handleDeleteImage = (id) => {
    dispatch(setLoading(true));
    axios
      .post(
        `${import.meta.env.VITE_APP_API}/removeimage`,
        { public_id: id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        dispatch(setLoading(false));
        toast.success("Image Deleted");
        // Remove Image from image state
        let filteredImages = images.filter((image) => {
          return image.public_id !== id;
        });
        setImages(filteredImages);
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
        toast.error(err.response.data.message);
      });
  };

  // UseEffect: Fetch Single Product
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col lg={12} className="bg-custom p-4 overflow-auto admin-container-height ">
          <div class="card shadow border-0 mb-7 p-3">
            <div class="card-header">
              <h5 class="mb-0">Update Product</h5>
            </div>
            <div class="card-body">
              <div className="d-flex flex-wrap mb-4">
                {images && (
                  <div className="d-flex flex-wrap gap-4 my-4">
                    {images.map((image, index) => (
                      <div className="image-container" key={index}>
                        <div className="position-relative">
                          <img
                            src={image.url}
                            alt={image.url}
                            width="120"
                            height="100"
                            className="border rounded"
                          />
                          <button
                            onClick={() => handleDeleteImage(image.public_id)}
                            className="btn btn-danger position-absolute top-0 end-0">
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`mt-4 ${images.length > 0 ? "ps-4" : ""}`}>
                  <label
                    className="btn border"
                    style={{
                      width: "150px",
                      height: "120px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    Click to Upload Image
                    <input
                      type="file"
                      name="file"
                      multiple
                      accept="images/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3 d-flex align-items-center">
                  <div className="flex-grow-1 me-3">
                    <label htmlFor="title" className="form-label">
                      Product Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex-grow-1 ">
                    <label htmlFor="price" className="form-label">
                      Product Price
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Product Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 d-flex align-items-center">
                  <div className="flex-grow-1 me-3">
                    <label htmlFor="condition" className="form-label">
                      Product Condition
                    </label>
                    <select
                      className="form-select"
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      required>
                      <option value="">Select Condition</option>
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div className="flex-grow-1">
                    <label htmlFor="category" className="form-label">
                      Product Category
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required>
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Cameras">Cameras</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Headphones">Headphones</option>
                      <option value="Food">Food</option>
                      <option value="Books">Books</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Sports">Sports</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Product
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProduct;
