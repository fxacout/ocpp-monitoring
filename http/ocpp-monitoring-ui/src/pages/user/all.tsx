import { use, useEffect, useState } from "react";
import { PageSkeleton } from "../../components/PageSkeleton";
import axios from "axios";
import Image from "next/image";
import Notiflix from "notiflix";
import { useRouter } from 'next/router';

export default function Page() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3002/user/all`).then((response) => {
      console.log(response.data);
      setUsers(response.data);
      setLoading(false);
    });
  });

  const onClickDelete = (name: string) => {
    Notiflix.Confirm.show(
      "Delete User",
      "Are you sure you want to delete this user?",
      "Yes",
      "No",
      () => {
        axios.delete(`http://localhost:3002/user/${name}`).then((response) => {
          console.log(response.data);
          Notiflix.Notify.success(`User ${name} deleted successfully`);
        });
        router.push("/user/all");
      }
    );
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <PageSkeleton>
      <div className="container">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Image</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  <a href={`/user/${user.name}`}>{user.name}</a>
                </td>
                <td>{user.email}</td>
                <td>
                  <Image
                    src={user.image}
                    alt={`User ${index + 1}`}
                    width={32}
                    height={32}
                  />
                </td>
                <td>Created at: {user.created_at}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => onClickDelete(user.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageSkeleton>
  );
}
