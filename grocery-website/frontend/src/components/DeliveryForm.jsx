import { useState } from "react";
import "./DeliveryForm.css";

const DeliveryForm = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!form.name || !form.phone || !form.address) {
      alert("All fields are required");
      return;
    }

    if (form.phone.length < 10) {
      alert("Enter a valid phone number");
      return;
    }

    if (form.address.length < 10) {
      alert("Address is too short");
      return;
    }

    // Send data back to Cart.jsx
    onSubmit(form);
  };

  return (
    <div className="delivery-backdrop">
      <div className="delivery-modal">
        <h3>Delivery Details</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            value={form.address}
            onChange={handleChange}
          />

          <div className="delivery-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn-submit">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm;
