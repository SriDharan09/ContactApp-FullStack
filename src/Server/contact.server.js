import axios from "axios";
const API_URL = "http://localhost:8080/contacts";

class ContactService {
  getAllContact() {
    return axios.get(API_URL);
  }
}

// eslint-disable-next-line
export default new ContactService();
