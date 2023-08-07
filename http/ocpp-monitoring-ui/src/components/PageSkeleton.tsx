import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { EventsNotifier } from "./EventsNotifier";
import { signIn, useSession } from "next-auth/react";
import { Button, Card, Container } from "react-bootstrap";
import axios from "axios";
import { socketServiceInstance } from "../service/SocketService";

export const PageSkeleton = ({
  children,
  authenticated,
  adminRequired,
}: {
  children: ReactNode;
  authenticated?: boolean;
  adminRequired?: boolean;
}) => {
  authenticated = adminRequired ? true : authenticated;
  const pathname = usePathname();
  const { status, data } = useSession();
  const image = data?.user?.image;
  const userName = data?.user?.name;
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (userName) {
      axios
        .get(`http://localhost:3002/user/${userName}`)
        .then((response) => {
          const data = response.data;
          setIsAdmin(data.admin === "true");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userName]);
  useEffect(() => {
    if (pathname && data?.user) {
      const parsedPathname = pathname.replaceAll("/", "-");
      socketServiceInstance.emitUserAction(
        {
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
          id: '10'
        },
        parsedPathname
      );
    }
  }, [pathname, data]);

  if (authenticated && status === "unauthenticated") {
    return (
      <div>
        <NavBar userName={userName!} isAdmin={isAdmin} image={image!}></NavBar>
        {/* <EventsNotifier></EventsNotifier> */}
        <Container>
          <Card className="mx-auto">
            <Card.Header className="mx-auto">Unauthorized</Card.Header>
            <Card.Body className="mx-auto">
              <Card.Text>You dont have permissions to see this page</Card.Text>
              <Button onClick={() => signIn()}>Sign in</Button>
            </Card.Body>
          </Card>
        </Container>
        <Footer></Footer>
      </div>
    );
  } else if (authenticated && adminRequired && !isAdmin) {
    return (
      <div>
        <NavBar userName={userName!} isAdmin={isAdmin} image={image!}></NavBar>
        {/* <EventsNotifier></EventsNotifier> */}
        <Container>
          <Card className="mx-auto">
            <Card.Header className="mx-auto">Unauthorized</Card.Header>
            <Card.Body className="mx-auto">
              <Card.Text>You need admin permission to see this page</Card.Text>
              <Button onClick={() => signIn()}>Sign in</Button>
            </Card.Body>
          </Card>
        </Container>
        <Footer></Footer>
      </div>
    );
  }
  return (
    <div>
      <NavBar userName={userName!} isAdmin={isAdmin} image={image!}></NavBar>
      {/* <EventsNotifier></EventsNotifier> */}
      {children}
      <Footer></Footer>
    </div>
  );
};
