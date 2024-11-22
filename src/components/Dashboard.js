//code 5
import React, { useState, useEffect } from "react";
import './Dashboard.css'; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

// Mock API functions to simulate server behavior
const mockAPI = {
  fetchUsers: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(mockAPI.users), 1000)
    ),
  createUser: (user) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ ...user, id: Date.now() }), 1000)
    ),
  updateUser: (updatedUser) =>
    new Promise((resolve) =>
      setTimeout(() => resolve(updatedUser), 1000)
    ),
  deleteUser: (id) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ message: "User deleted successfully", id }), 1000)
    ),
  fetchRoles: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(mockAPI.roles), 1000)
    ),
  assignPermissions: (userId, permissions) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ userId, permissions }), 1000)
    ),
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);  // Initialized as empty array
  const [roles, setRoles] = useState([]);  // Initialized as empty array
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users and roles when component mounts
  useEffect(() => {
    setLoading(true);
    mockAPI.fetchUsers().then((data) => {
      setUsers(data || []);  // Ensuring users is set to an empty array if data is undefined
      setLoading(false);
    });
    mockAPI.fetchRoles().then((data) => {
      setRoles(data || []);  // Ensuring roles is set to an empty array if data is undefined
    });
  }, []);

  // Handle User Form (Add/Update)
  const handleUserForm = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const role = e.target.role.value;
    const status = e.target.status.value;

    setLoading(true);

    if (selectedUser) {
      // Update user
      mockAPI.updateUser({ ...selectedUser, name, role, status }).then((updatedUser) => {
        setUsers(
          users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        alert("User updated successfully!");  // Show alert message
        setSelectedUser(null);
        setLoading(false);
      });
    } else {
      // Add new user
      mockAPI.createUser({ name, role, status, permissions: [] }).then((newUser) => {
        setUsers([...users, newUser]);
        alert("User added successfully!");  // Show alert message
        setLoading(false);
      });
    }
    e.target.reset();
  };

  // Handle Role Form (Assign Permissions)
  const handleRoleForm = (e) => {
    e.preventDefault();
    const userId = e.target.user.value;
    const permissions = Array.from(e.target.permissions)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    setLoading(true);

    mockAPI.assignPermissions(userId, permissions).then((response) => {
      setUsers(
        users.map((user) =>
          user.id === parseInt(userId) ? { ...user, permissions } : user
        )
      );
      alert("Permissions updated successfully!");  // Show alert message
      setLoading(false);
    });
    e.target.reset();
  };

  // Handle Delete User
  const handleDeleteUser = (id) => {
    setLoading(true);
    mockAPI.deleteUser(id).then((response) => {
      setUsers(users.filter((user) => user.id !== id));
      alert(response.message);  // Show alert message
      setLoading(false);
    });
  };

  return (
    <div className="container mt-5 dashboard-container">
      <h1>Admin Dashboard</h1>
      {loading && <div className="alert alert-warning">Loading...</div>}
      <div className="row">
        {/* User Management */}
        <div className="col-md-6 dives">
          <h3>User Management</h3>
          <form onSubmit={handleUserForm} className="mb-4">
            <input
              type="text"
              name="name"
              defaultValue={selectedUser?.name || ""}
              className="form-control mb-2"
              placeholder="Enter user name"
              required
            />
            <select
              name="role"
              defaultValue={selectedUser?.role || ""}
              className="form-control mb-2"
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              name="status"
              defaultValue={selectedUser?.status || ""}
              className="form-control mb-2"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="btn btn-primary">
              {selectedUser ? "Update User" : "Add User"}
            </button>
          </form>
          <ul className="list-group">
            {users.length > 0 ? (
              users.map((user) => (
                <li
                  key={user.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.name}</strong> ({user.role}) - {user.status}
                    <br />
                    <small>
                      Permissions: {user.permissions.join(", ")}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">No users found.</li>
            )}
          </ul>
        </div>

        {/* Role Management */}
        <div className="col-md-6 dives">
          <h3>Role Management</h3>
          <form onSubmit={handleRoleForm} className="mb-4">
            <select
              name="user"
              defaultValue=""
              className="form-control mb-2"
              required
            >
              <option value="" disabled>
                Select User
              </option>
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No users available
                </option>
              )}
            </select>
            <div className="permissions-grid">
  <label>
    <input
      type="checkbox"
      name="permissions"
      value="Read"
      defaultChecked={selectedUser?.permissions?.includes("Read")}
    />
    Read
  </label>
  <label>
    <input
      type="checkbox"
      name="permissions"
      value="Write"
      defaultChecked={selectedUser?.permissions?.includes("Write")}
    />
    Write
  </label>
  <label>
    <input
      type="checkbox"
      name="permissions"
      value="Delete"
      defaultChecked={selectedUser?.permissions?.includes("Delete")}
    />
    Delete
  </label>
</div>

            {/* <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  name="permissions"
                  value="Read"
                  defaultChecked={selectedUser?.permissions?.includes("Read")}
                />{" "}
                Read
              </label>
            </div>
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  name="permissions"
                  value="Write"
                  defaultChecked={selectedUser?.permissions?.includes("Write")}
                />{" "}
                Write
              </label>
            </div>
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  name="permissions"
                  value="Delete"
                  defaultChecked={selectedUser?.permissions?.includes("Delete")}
                />{" "}
                Delete
              </label>
            </div> */}
            <button className="btn btn-primary">
              {selectedUser ? "Update Permissions" : "Assign Permissions"}
            </button>
          </form>

          {/* Display users and their associated permissions */}
          <h4>User Permissions</h4>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user.id} className="list-group-item">
                <strong>{user.name}</strong> ({user.role}) -{" "}
                <span>{user.permissions.join(", ") || "No Permissions"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


