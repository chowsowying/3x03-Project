import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const Loading = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center container-height">
      <Spinner animation="border" role="status" />
    </Container>
  );
};

export default Loading;
