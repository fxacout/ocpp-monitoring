import { useState } from 'react';
import { PageSkeleton } from '../components/PageSkeleton';
import { Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { hash } from '../utils/hash';
import Notiflix from 'notiflix';
import { useRouter } from 'next/router';

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // You can handle form submission logic here, e.g., sending data to a server.
    console.log('Form submitted:', formData);
    axios
          .post(`http://localhost:3002/user`, {
            password: hash(formData.password),
            email: formData.email,
            name: formData.username,
            image: '/user.png',
            provider: 'credentials'
          })
          .then((response) => {
            console.dir(response);
            if (response.statusText === "OK") {
              Notiflix.Notify.success("User created successfully");
              router.push("/");
            }
          });
  };

  return (
    <PageSkeleton>
      <Container>
        <Row>
          <h1>Sign Up</h1>
        </Row>
      <Row>
      <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    </div>
    </Row>
      </Container>
    </PageSkeleton>
  );
};

export default SignUp;