import { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../api/user.api.js";
import "./MyProfile.css";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    emailOrMobile: "",
    password: "",
  });

  // Load profile
  const loadProfile = () => {
    fetchMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          emailOrMobile: res.data.emailOrMobile,
          password: "",
        });
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            "Failed to load profile"
        );
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Update profile
  const handleUpdate = async () => {
    try {
      await updateMyProfile(form);
      alert("Profile updated successfully");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  // Error state
  if (error) {
    return <p className="page error-text">{error}</p>;
  }

  // Loading state
  if (!profile) {
    return <p className="page">Loading profile...</p>;
  }

  return (
    <div className="page profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        {!editMode ? (
          <>
            <div>
              <label>Name</label>
              <p>{profile.name}</p>
            </div>

            <div>
              <label>Email / Mobile</label>
              <p>{profile.emailOrMobile}</p>
            </div>

            <div>
              <label>Password</label>
              <p>********</p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <div>
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label>Email / Mobile</label>
              <input
                value={form.emailOrMobile}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emailOrMobile: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label>New Password (optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep same"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="profile-actions">
              <button
                className="btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
