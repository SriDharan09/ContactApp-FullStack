import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import ContactList from "./Component/ContactList";
import Header from "./Component/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import { getContacts, saveContact, updatePhoto } from "./Server/ContactService";

function App() {
  // -------------------- State Management Start------------------- //

  const fileRef = useRef();
  const modalRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  // --------------------State Management End------------------- //

  // Get All contact
  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data);
    } catch (err) {
      console.log(err);
      fileRef.current.value = null;
    }
  };

  // OnMount Load all Data fromserver by calling GetAllContact Method
  useEffect(() => {
    getAllContacts();
  }, []);

  // -------------------- getAllContact On Load End------------------- //

  // Modal Toggle
  const toggleModal = (show) => {
    if (show) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  };

  // -------------------- Toggle Form End------------------- //

  // On change of value change the state
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // On submit of form call saveContact sercvice to save things
  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.id);
      const { data: photoUrl } = await updatePhoto(formData);

      // set default values
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
      });
      // toastSuccess("Contact Added");

      getAllContacts();
    } catch (error) {
      console.log(error);
      // toastError(error.message);
    }
  };
  console.log(values);
      // -------------------- SaveContact End------------------- //


  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              {/* Input Box */}

              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={values.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  value={values.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>

              <div className="input-box">
                <span className="details">Account Status</span>
                <select
                  value={values.status}
                  onChange={onChange}
                  name="status"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Not Active">Not Active</option>
                </select>
              </div>

              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={(event) => setFile(event.target.files[0])}
                  ref={fileRef}
                  name="photo"
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
