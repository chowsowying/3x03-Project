import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap/";
import { CreateNewForm, GetSingleUser } from "../../api/userAPI";
import { setLoading } from "../../redux/loaderSlice";

const ContactAdmin = () => {
  const [sender, setSender] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const values = {
    title,
    description,
    sender,
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Check if both title and description are not empty
    setIsFormValid(title.trim() !== "" && description.trim() !== "");
  }, [title, description]);

  // Function: Get Single User
  const fetchUser = async () => {
    try {
      const response = await GetSingleUser(user.token);
      // Set sender as email 
      setSender(response.data.email);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Function: Send Form
  const handleClick = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill in both the title and description fields.");
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await CreateNewForm(values, user.token);
      dispatch(setLoading(false));
      toast.success(response.data.message);
      setTitle("");
      setDescription("");
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response.data.message);
    }
  };

   // UseEffect: Fetch Single User
   useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fluid className="order d-flex align-items-center justify-content-center">
      <Row>
        <Col lg={12} className="p-4 overflow-auto container-height">
          <h1 className="mb-4">Contact an Admin</h1>
          <div style={{ maxWidth: "650px" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Subject Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subject Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Describe your Problem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="d-grid gap-2">
              <Button
                onClick={handleClick}
                variant="primary"
                type="submit"
                disabled={!isFormValid} // Disable the button if the form is not valid
              >
                Send
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactAdmin;