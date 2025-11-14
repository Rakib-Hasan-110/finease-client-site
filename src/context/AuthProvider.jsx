import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Renamed the setter to the standard 'setLoading'
  const [loading, setLoading] = useState(true); 
  const [emailInput, setEmailInput] = useState("");

  // *** REMOVED: The flawed setLoadingSystem function ***

  const createUser = (email, password) => {
    setLoading(true);
    // The component calling this function will handle the .finally(() => setLoading(false))
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    // The component calling this function will handle the .finally(() => setLoading(false))
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
    // setLoading(true) is not strictly needed here since the finality handles it,
    // but it's okay to keep for immediate feedback if desired.
    setLoading(true); 
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#44C223",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Logged Out!",
              text: "You have been logged out successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
            });
          })
          .finally(() => setLoading(false)); // Correctly handles loading state
      } else {
        setLoading(false); // Set loading to false if the user cancels the action
      }
    });
  };

  const signInWithGoogle = () => {
    setLoading(true);
    // Added .finally() to ensure loading is set to false after sign-in attempt
    return signInWithPopup(auth, googleProvider).finally(() => setLoading(false)); 
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Password reset email has been sent. Check your inbox.",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      })
      .finally(() => setLoading(false)); // Correctly handles loading state
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your name and profile image have been updated successfully.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: error.message,
      });
    } finally {
      setLoading(false); // Correctly handles loading state
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Simplified cleanup function
    return unsubscribe; 
  }, []);

  const authInfo = {
    user,
    loading,
    // Exposed the direct state setter for external control when needed
    setLoading, 
    createUser,
    loginUser,
    logoutUser,
    signInWithGoogle,
    resetPassword,
    emailInput,
    setEmailInput,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;