import { useRouter } from "next/router";
import { PageSkeleton } from "../components/PageSkeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Container, Row } from "react-bootstrap";
import { useSession } from "next-auth/react";
import Notiflix from "notiflix";
import { hash } from "../utils/hash";

export default function Page() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name;
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
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
    console.log("Form submitted:", formData);
    Notiflix.Confirm.show(
      "Change Password",
      "Are you sure you want to change your password?",
      "Yes",
      "No",
      () => {
        axios
          .put(`http://localhost:3002/user/${userName}`, {
            password: hash(formData.password),
          })
          .then((response) => {
            console.dir(response);
            if (response.statusText === "OK") {
              Notiflix.Notify.success("Password changed successfully");
              router.push("/");
            }
          });
      }
    ),
      () => {};
  };

  useEffect(() => {
    if (userName)
      axios.get(`http://localhost:3002/user/${userName}`).then((response) => {
        console.log(response.data);
        setUser(response.data);
        setLoading(false);
      });
  }, [userName]);

  if (loading && status !== "unauthenticated") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    if (status !== "authenticated") {
      return (
        <PageSkeleton>
          <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
            <div className="card p-4">
              <span>You are unauthenticated</span>
              <br></br>
              <Button className="btn-secondary" href="/">
                Return to Home page
              </Button>
            </div>
          </div>
        </PageSkeleton>
      );
    }
  }

  return (
    <PageSkeleton>
      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
        <div className="card p-4">
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            <button className="btn btn-secondary">
              <Image
                src={user.image || "/user.png"}
                height="100"
                width="100"
                alt="user image"
              />
            </button>
            <span className="name mt-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>{" "}
              {user.name}
            </span>
            <div className="d-flex flex-row justify-content-center align-items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-envelope-at"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                  <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648Zm-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                </svg>{" "}
                {user.email}
              </span>
            </div>{" "}
            <div className=" px-2 rounded mt-4 date ">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-calendar-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
              </svg>{" "}
              <span className="join">Joined {user.created_at}</span>{" "}
            </div>{" "}
            <hr className="mt-2 mb-3" />
            {user.provider !== "google" && (
              <Container>
                <Row>
                  <h3>Change password</h3>
                </Row>
                <Row>
                  <div className="container mt-4">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="password">New Password</label>
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
            )}
            {user.provider === "google" && (
              <Container>
                <Row>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>
                  <h3 className='text-center'>Google account</h3>
                </Row>
                <Row>
                  <span className='text-center'>
                    You are using Google account to sign in. You can change your
                    password in your Google account settings.
                  </span>
                </Row>
              </Container>
            )}
          </div>{" "}
        </div>
      </div>
    </PageSkeleton>
  );
}
