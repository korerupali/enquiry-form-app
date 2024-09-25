import { Col, Container, Row, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

function App() {
  let [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userMsg: "",
    index: "",
  });

  let [userData, setUserData] = useState([]);

  let getValue = (event) => {
    let oldData = { ...formData };
    let inputName = event.target.name;
    let inputValue = event.target.value;
    oldData[inputName] = inputValue;
    setFormData(oldData);
  };

  let validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  let validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; 
    return phoneRegex.test(phone);
  };

  let handleSubmit = (event) => {
    event.preventDefault();

    // form Validation checks
    if (!formData.userName || !formData.userEmail || !formData.userPhone || !formData.userMsg) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateEmail(formData.userEmail)) {
      toast.error("Invalid email format!");
      return;
    }

    if (!validatePhone(formData.userPhone)) {
      toast.error("Invalid phone number! Please enter a 10-digit number.");
      return;
    }

    let currentFormUserData = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPhone: formData.userPhone,
      userMsg: formData.userMsg,
    };

    if (formData.index === "") {
      let checkFilterUserData = userData.filter(
        (v) => v.userEmail === formData.userEmail || v.userPhone === formData.userPhone
      );

      if (checkFilterUserData.length === 1) {
        toast.error("Email or Phone already exists...");
      } 
      
      else {
        let oldUserData = [...userData, currentFormUserData];
        setUserData(oldUserData);
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          userMsg: "",
          index: "",
        });
        toast.success("Data saved successfully!");
      }
    }
    
    else {
      let editIndex = formData.index;
      let oldData = userData;

      let checkFilterUserData = userData.filter(
        (v, i) => (v.userEmail === formData.userEmail || v.userPhone === formData.userPhone) && i !== editIndex
      );

      if (checkFilterUserData.length === 0) {
        oldData[editIndex]["userName"] = formData.userName;
        oldData[editIndex]["userEmail"] = formData.userEmail;
        oldData[editIndex]["userPhone"] = formData.userPhone;
        oldData[editIndex]["userMsg"] = formData.userMsg;

        setUserData(oldData);
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          userMsg: "",
          index: "",
        });
        toast.success("Data updated successfully!");
      }

       else {
        toast.error("Email or phone number already exists for another entry.");
      }
    }
  };

  let deleteRow = (indexNum) => {
    let filterDataAfterDelete = userData.filter((v, i) => i !== indexNum);
    toast.success("Data deleted successfully");
    setUserData(filterDataAfterDelete);
  };

  let editRow = (indexNum) => {
    let editData = userData.filter((v, i) => i === indexNum)[0];
    editData["index"] = indexNum;
    setFormData(editData);
  };

  return (
    <Container fluid>
      <ToastContainer />
      <Container>
        <Row>
          <Col className="text-center py-5">
            <h1 className="display-4 text-primary">Enquiry Form</h1>
          </Col>
        </Row>

        <Row>
          <Col lg={5} md={6} sm={12} className="mb-4">
            <form onSubmit={handleSubmit}>
              <div className="pb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  onChange={getValue}
                  name="userName"
                  value={formData.userName}
                  className="form-control"
                  required
                />
              </div>
              <div className="pb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  onChange={getValue}
                  name="userEmail"
                  value={formData.userEmail}
                  className="form-control"
                  required
                />
              </div>

              <div className="pb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  onChange={getValue}
                  name="userPhone"
                  value={formData.userPhone}
                  className="form-control"
                  required
                />
              </div>

              <div className="pb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  onChange={getValue}
                  value={formData.userMsg}
                  name="userMsg"
                  rows="3"
                  required
                  style={{ maxHeight: "150px", overflowY: "auto" }} // Set max height and enable scrolling
                />
              </div>

              <button className="btn btn-primary">
                {formData.index !== "" ? "Update" : "Save"}
              </button>
            </form>
          </Col>

          <Col lg={7} md={6} sm={12}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.length >= 1 ? (
                  userData.map((obj, ind) => {
                    return (
                      <tr key={ind}>
                        <td>{ind + 1}</td>
                        <td>{obj.userName}</td>
                        <td>{obj.userEmail}</td>
                        <td>{obj.userPhone}</td>
                        <td>{obj.userMsg}</td>
                        <td className="text-center align-middle">
                          <button
                            className="btn btn-danger btn-sm me-lg-2  mb-2 mb-lg-0 "
                            onClick={() => deleteRow(ind)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => editRow(ind)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>No Data Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default App;
