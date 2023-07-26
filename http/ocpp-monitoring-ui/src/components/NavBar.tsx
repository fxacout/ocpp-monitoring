import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Container from 'react-bootstrap/Container';
import { signOut, useSession } from "next-auth/react";
import { Session } from 'next-auth';
import Image from 'next/image';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const navigation = [
  { name: "Dashboard", href: "#", current: true }
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function NavBarLoggedIn(session: Session) {
  const { name, image } = session.user!;
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="http://localhost:3000/favicon.ico"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="http://localhost:3000/favicon.ico"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">

                    <a
                      className={classNames(
                        "text-white"
                      )}
                    >
                      {`Hello! ${name}`}
                    </a>

                  </div>
                </div>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={image!}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }: { active: boolean }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onSubmit={() => signOut()}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function NavBarUnauthenticated() {
  return (
    <div className="bg-gray-800 ">
            <div className="flex space-x-4">
              <Image
                className="" 
                src="/favicon.ico"
                width={32}
                height={32}
                alt="OCPP Monitoring"
              />
              <a className=''>OCPP Monitoring</a>
            </div>
    </div>
  );
}

const isLoggedIn = (session: Session) => session && session.user;

export function NavBar() {
  const { data: session } = useSession();
  // if (session) {
  //   return NavBarLoggedIn(session);
  // }
  // return NavBarUnauthenticated();

  const authorizedHtml = (isLoggedIn(session!)) ? (
    <div>
      <Nav.Link href="/dashboard">Dashboard</Nav.Link>
    <Nav.Link href="/chargepoints">Map</Nav.Link>
    <NavDropdown title={`Hi ${session!.user!.name}`} id="basic-nav-dropdown">
      <NavDropdown.Item href="/me">Profile</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={() => signOut()}>
        Sign Out
      </NavDropdown.Item>
    </NavDropdown>
    </div>
  ) : ( <div></div>)


  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#home">OCPP Monitoring</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
           {authorizedHtml}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
  
}
