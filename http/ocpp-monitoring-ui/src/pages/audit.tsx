import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { PageSkeleton } from '../components/PageSkeleton';

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint for fetching data.
  const API_ENDPOINT = `http://localhost:3001/user/all?page=${pageNumber}`;

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]); // Fetch data whenever the pageNumber changes

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Intersection Observer callback to load more data when reaching the bottom of the table
  const handleIntersection = (entries: any) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, [loading]);

  const typeParsed = (type: string) => {
    if (type.indexOf('-') > -1) {
      return type.replaceAll('-', '/');
    }
    return type
  }

  return (
    <PageSkeleton adminRequired={true}>
      <div className="container">
      <table className="table table-bordered table-striped" ref={tableRef}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Image</th>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td><a href={`/user/${user.name}`}>{user.name}</a></td>
              <td>{user.email}</td>
              <td>
                <Image src={user.image} alt={`User ${index + 1}`} width={32} height={32}/>
              </td>
              <td>{typeParsed(user.type)}</td>
              <td>{user.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </PageSkeleton>
  );
};