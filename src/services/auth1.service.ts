import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithCredential, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { post, getByFilters } from "@/lib/firestoreCrud";

// First, add a function to fetch user data
const fetchUserData = async (userId: string) => {
  const result = await getByFilters("users", [
    { key: "userId", operator: "==", value: userId }
  ]);
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
  try {
    const userData = await fetchUserData(userCred.user.uid);
    saveUserToStorage(userData);
    return { user: userCred.user, userData };
  } catch (err) {
    console.warn("User profile not found for user:", userCred.user.uid);
    return { user: userCred.user, userData: null } as const;
  }
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

// Function to create user profile in Firestore
const createProfile = async (
  email: string,
  userId: string,
  firstname: string,
  lastname: string,
  username: string,
  avatar: string,
  userType?: string
) => {
  return post("users", {
    email,
    userId,
    name: `${firstname} ${lastname}`,
    userType: userType || "customer",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    phone: "",
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

  await createProfile(email, userId, firstname, lastname, username, avatar, userType);
  
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
    
    if (!userExists) {
      const nameParts = user.displayName?.split(' ') || ['', ''];
      const firstname = nameParts[0];
      const lastname = nameParts[nameParts.length - 1];
      
      await createProfile(
        user.email || '',
        user.uid,
        firstname,
        lastname,
        firstname.toLowerCase() + lastname.toLowerCase(),
        user.photoURL || '',
        'customer'
      );
    }
    
    // Fetch and save user data
    const userData = await fetchUserData(user.uid);
    saveUserToStorage(userData);
    
    return { user, userData };
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