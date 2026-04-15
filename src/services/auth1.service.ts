import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { getByFilters } from "@/lib/firestoreCrud";

const fetchUserData = async (uid: string, email?: string | null) => {
  // Try finding by userId
  let result = await getByFilters("users", [
    { key: "userId", operator: "==", value: uid }
  ]);

  // Alternative 1: Try finding by uid field if userId is different
  if (result.data.length === 0) {
    result = await getByFilters("users", [
      { key: "uid", operator: "==", value: uid }
    ]);
  }

  // Alternative 2: Try finding by email
  if (result.data.length === 0 && email) {
    result = await getByFilters("users", [
      { key: "email", operator: "==", value: email }
    ]);
  }

  if (result.data.length === 0) {
    throw new Error("User profile not found");
  }
  return result.data[0];
};

// Function to save user data to localStorage
const saveUserToStorage = (userData: any) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

// Function to sign in with credentials
const credSignIn = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  let userData;
  try {
    userData = await fetchUserData(userCred.user.uid, userCred.user.email);
  } catch (err) {
    console.warn("User profile not found for user:", userCred.user.uid, "email:", userCred.user.email);
    return { user: userCred.user, userData: null } as const;
  }


  saveUserToStorage(userData);

  let token = null;
  try {
    token = await userCred.user.getIdToken();
    console.log("Firebase ID Token:", token);
  } catch (tokenErr) {
    console.warn("Could not get ID Token:", tokenErr);
  }

  return { user: userCred.user, userData, token };
};

// Custom Hook: Sign in with Email & Password
export const useCredSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      credSignIn(email, password),
    onSuccess: (data) => {
      console.log("Signed in:", { uid: data.user?.uid, email: data.user?.email });
      if (data.userData) {
        console.log("User data:", data.userData);
      } else {
        console.warn(
          "User data not found. Ensure a document exists in 'users' with userId = UID."
        );
      }
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    },
  });
};



// Function to handle sign-up with email and password
const signUpWithEmail = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  userType: string,
  avatar: string,
  username: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  try {
    const idToken = await userCredential.user.getIdToken();
    const bootstrapResponse = await fetch("https://api-wki5bofifq-uc.a.run.app/auth/bootstrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        requestedRole: "merchant"
      })
    });

    if (!bootstrapResponse.ok) {
      console.error("Failed to bootstrap user role via API", await bootstrapResponse.text());
    } else {
      console.log("Successfully bootstrapped user role");
    }

    const profilePayload = {
      firstName: firstname,
      lastName: lastname,
      name: `${firstname} ${lastname}`,
      phoneNumber: "", // Phone is not collected in standard email signup
      defaultLocation: {
        additionalProp1: {}
      }
    };

    const profileResponse = await fetch("https://api-wki5bofifq-uc.a.run.app/accounts/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify(profilePayload)
    });

    if (!profileResponse.ok) {
      console.error("Failed to update profile via API", await profileResponse.text());
    } else {
      console.log("Successfully updated profile via API");
    }

  } catch (err) {
    console.error("Error calling bootstrap or profile APIs:", err);
  }

  return userId;
};

// Custom Hook: Sign Up with Email & Password
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email, password, firstname, lastname, userType, avatar, username,
    }: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      userType: string;
      avatar: string;
      username: string;
    }) => signUpWithEmail(email, password, firstname, lastname, userType, avatar, username),

    onSuccess: (userId) => {
      console.log("User registered:", userId);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    },
  });
};

// Function to check if user exists
const checkUserExists = async (userId: string) => {
  const result = await getByFilters("users", [
    { key: "userId", operator: "==", value: userId }
  ]);
  return result.data.length > 0;
};

// Function to sign in with Google
export const socialLogin = async (accessToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if user exists in users collection
    const userExists = await checkUserExists(user.uid);
    const isNewUser = !userExists;

    if (isNewUser) {
      const nameParts = user.displayName?.split(' ') || ['', ''];
      const firstname = nameParts[0];
      const lastname = nameParts[nameParts.length - 1];

      try {
        const idToken = await user.getIdToken();
        const bootstrapResponse = await fetch("https://api-wki5bofifq-uc.a.run.app/auth/bootstrap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            requestedRole: "merchant"
          })
        });

        if (!bootstrapResponse.ok) {
          console.error("Failed to bootstrap user role via API", await bootstrapResponse.text());
        } else {
          console.log("Successfully bootstrapped user role");
        }

        const profilePayload = {
          firstName: firstname,
          lastName: lastname,
          name: user.displayName || "",
          phoneNumber: user.phoneNumber || "",
          defaultLocation: {
            additionalProp1: {}
          }
        };

        const profileResponse = await fetch("https://api-wki5bofifq-uc.a.run.app/accounts/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify(profilePayload)
        });

        if (!profileResponse.ok) {
          console.error("Failed to update profile via API", await profileResponse.text());
        } else {
          console.log("Successfully updated profile via API");
        }

      } catch (err) {
        console.error("Error calling bootstrap or profile APIs:", err);
      }
    }

    // Fetch and save user data
    let userData = null;
    try {
      userData = await fetchUserData(user.uid, user.email);
      saveUserToStorage(userData);
    } catch (err) {
      console.warn("User profile not found for social user:", user.uid, "email:", user.email);
    }

    let token = null;
    try {
      token = await user.getIdToken();
      console.log("Firebase ID Token (Social):", token);
    } catch (tokenErr) {
      console.warn("Could not get ID Token:", tokenErr);
    }

    return { user, userData, token };
  } catch (error) {
    console.error("Social login error:", error);
    throw error;
  }
};

// Custom Hook: Google Sign-In
export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accessToken: string) => socialLogin(accessToken),
    onSuccess: (data) => {
      console.log("Google Sign-In Success:", data.user);
      console.log("User data:", data.userData);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    },
  });
};

// Function to handle logout
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('userData'); // Remove user data specifically
    sessionStorage.clear();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Custom Hook: Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all queries from the cache
      queryClient.clear();
      // Or if you want to be more specific, invalidate specific queries:
      // queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // queryClient.invalidateQueries({ queryKey: ["vendors"] });

      console.log("Logged out successfully");
    },
    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    },
  });
};