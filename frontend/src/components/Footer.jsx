import React from "react";
import { MDBFooter, MDBContainer, MDBCol, MDBRow, MDBBtn } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";

const Footer = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      {user && user.role === "admin" && (
        <MDBFooter className="bg-light text-center border">
          {/* <MDBContainer className="p-4 pb-0">
            <section>
              <p className="d-flex justify-content-center align-items-center">
                <span className="fw-bold">ThirdLife: Give your product a third chance </span>
              </p>
            </section>
          </MDBContainer> */}

          <div className="text-center p-3">© 2023 Copyright Team 35</div>
        </MDBFooter>
      )}
      {user && user.role === "user" && (
        <MDBFooter className="bg-dark text-center border">
          <MDBContainer className="p-4 pb-0">
            <section>
              <p className="d-flex justify-content-center align-items-center">
                <a href="/user/contact-admin">
                  <MDBBtn type="button" outline color="light" rounded>
                    Contact an Admin
                  </MDBBtn>
                </a>
              </p>
            </section>
          </MDBContainer>
          {/* <div className="text-center p-3">© 2023 Copyright Team 35</div> */}
        </MDBFooter>
      )}
    </div>
  );
};

export default Footer;
