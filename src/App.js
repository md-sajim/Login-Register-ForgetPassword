import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateCurrentUser,
} from "firebase/auth";
import app from "./firebase.init";
import { useState } from "react";
const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handelRegisterChange = (event) => {
    setRegister(event.target.checked);
  };
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };
  const handleFromSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*[0-9])/.test(password)) {
      setError("Password Should contain at least one special character");
      return;
    }
    setValidated(true);
    if (register) {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          setEmail("");
          setPassword("");
          verifyEmail();
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
      event.preventDefault();
    }
  };
  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Email Sent");
    });
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email Verification Sent");
    });
  };

  return (
    <div>
      {/* <form onSubmit={handleFromSubmit}>
        <input onBlur={handleEmailBlur} type="email" name="" id="" />
        <input onBlur={handlePasswordBlur} type="password" name="" id="" />
        <input type="submit" value="Login" />
      </form> */}

      <div className="registration w-50 mx-auto mt-3">
        <h2 className="text-primary">
          Please {register ? "LogIn!!" : "Register!!"}
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFromSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />

            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email Address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handelRegisterChange}
              type="checkbox"
              label="Already register"
            />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button onClick={handleForgetPassword} variant="link">
            Forget Password
          </Button>
          <Button variant="primary" type="submit">
            {register ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
