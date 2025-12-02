import "./Signup.css";
import { useState } from "react";

export const Signup = () => {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setShowForm(false);
    setFeedbackMessage(
      "An account verification email has been sent to your email address."
    );

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      email_id: form.email,
      platform_type: "web",
    };

    try {
      const auth = window.catalyst.auth;
      const response = await auth.signUp(payload);

      if (response.status === 200) {
        setTimeout(() => {
          window.location.href = "index.html";
        }, 3000);
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div id="signup" className="signup">
      {showForm ? (
        <div className="signup-card">
          <img
            src="https://img1.wsimg.com/isteam/ip/fa32fa94-50a8-4a5c-9525-4781001c7a28/blob-4bf291d.png/:/rs=w:90,h:81,cg:true,m/cr=w:90,h:81/qt=q:100/ll"
            alt="User Profile Management"
          />
          <h1>Indiamart2ZohoCRM</h1>
          <p>Please fill this form to create a new account.</p>

          <form onSubmit={handleSubmit} className="modal-content">
            <label>
              <b>First Name</b>
              <input
                name="firstName"
                className="inputs"
                placeholder="Enter First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <b>Last Name</b>
              <input
                name="lastName"
                className="inputs"
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <b>Email</b>
              <input
                name="email"
                className="inputs"
                placeholder="Enter Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <p>
              By creating an account, you agree to our{" "}
              <a
                href="https://www.zoho.com/catalyst/terms.html"
                target="_blank"
                rel="noopener noreferrer"
                id="link"
              >
                Terms & Conditions
              </a>
              .
            </p>

            <input type="submit" value="Sign Up" />
          </form>
        </div>
      ) : (
        <div className="feedback-message">{feedbackMessage}</div>
      )}
    </div>
  );
};
