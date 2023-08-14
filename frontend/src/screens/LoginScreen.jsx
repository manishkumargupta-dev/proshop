import { useState } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/userApiSlice";
import Message from "../components/Message";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const forward = searchParams.get("redirect") || "/";

  if (userInfo) {
    return <Navigate to={forward} />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(forward);
    } catch (err) {
      setError(err);
    }
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Sign In</h1>

          {error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : null}

          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button disabled={isLoading} type="submit" variant="primary">
              Sign In
            </Button>

            {isLoading && <Loader />}
          </Form>

          <Row className="py-3">
            <Col>
              New Customer?{" "}
              <Link
                to={forward ? `/register?redirect=${forward}` : "/register"}
              >
                Register
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
