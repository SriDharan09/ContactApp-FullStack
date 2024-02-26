import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getContact } from "../Server/ContactService";
import { Link } from "react-router-dom";
import { toastSuccess, toastError } from "../Server/ToastService";
const ContactDetail = ({ updateContact, updateImage }) => {
  const inputRef = useRef();
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    photoUrl: "",
  });
  const { id } = useParams();

  const fetchcontact = async (id) => {
    try {
      const { data } = await getContact(id);
      setContact(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };
  const onUpdateContact = async (event) => {
    event.preventDefault();
    await updateContact(contact);
    fetchcontact(id);
    toastSuccess("Contact updated");
  };

  useEffect(() => {
    toastSuccess("Contact Retrieved");

    fetchcontact(id);
  }, [id]);

  const selectImage = () => {
    inputRef.current.click();
  };

  const updatePhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);
      await updateImage(formData);

      setContact((prev) => {
        return {
          ...prev,
          photoUrl: `${prev.photoUrl}&updated_at=${new Date().getTime()}`,
        };
      });
      fetchcontact(id);
      toastSuccess("Photo updated");
    } catch (e) {
      toastError(e.message);
      console.log(e);
    }
  };
  return (
    <>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-arrow-left"></i> Back
      </Link>

      <div className="profile">
        <div className="profile__details">
          <img src={contact.photoUrl} alt={`Profile of ${contact.name}`} />
          <div className="profile__metadata">
            <p className="profile__name">Name: {contact.name}</p>
            <p className="profile__muted">JPG, PNG, GIF , JPEG, (MAX.1024MB)</p>
            <button className="btn" onClick={selectImage}>
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>
        <div className="profile__settings">
          <div>
            <form onSubmit={onUpdateContact} className="form">
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Id</span>

                  <input
                    type="text"
                    name="id"
                    disabled
                    defaultValue={contact.id}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Name</span>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={onChange}
                    name="name"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={onChange}
                    name="email"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Title</span>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={onChange}
                    name="title"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Phone Number</span>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={onChange}
                    name="phone"
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={onChange}
                    name="address"
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Account Status</span>
                  <select
                    value={contact.status}
                    onChange={onChange}
                    name="status"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Not Active">Not Active</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="form_footer">
                <button type="submit" className="btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <form style={{ display: "none" }}>
        <input
          type="file"
          name="file"
          ref={inputRef}
          onChange={(e) => updatePhoto(e.target.files[0])}
          accept="image/*"
        />
      </form>
    </>
  );
};

export default ContactDetail;
