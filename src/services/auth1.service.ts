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

// First, add a function to fetch vendor data
const fetchVendorData = async (userId: string) => {
  const result = await getByFilters("vendors", [
    { key: "userId", operator: "==", value: userId }
  ]);
  if (result.data.length === 0) {
    throw new Error("Vendor profile not found");
  }
  return result.data[0];
};

// Function to save vendor data to localStorage
const saveVendorToStorage = (vendorData: any) => {
  localStorage.setItem('vendorData', JSON.stringify(vendorData));
};

// Function to sign in with credentials
const credSignIn = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  try {
    const vendorData = await fetchVendorData(userCred.user.uid);
    saveVendorToStorage(vendorData);
    return { user: userCred.user, vendorData };
  } catch (err) {
    console.warn("Vendor profile not found for user:", userCred.user.uid);
    return { user: userCred.user, vendorData: null } as const;
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
      if (data.vendorData) {
        console.log("Vendor data:", data.vendorData);
      } else {
        console.warn(
          "Vendor data not found. Ensure a document exists in 'vendors' with userId = UID."
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
  role?: string
) => {
  return post("vendors", {
    email,
    userId,
    firstname,
    lastname,
    username,
    avatar,
    role: role || "user",
    createdAt: new Date().toISOString(),
    isActive: true,
  });
};

// Function to handle sign-up with email and password
const signUpWithEmail = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
  role: string,
  avatar: string,
  username: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = userCredential.user.uid;

  await createProfile(email, userId, firstname, lastname, username, avatar, role);
  
  return userId;
};

// Custom Hook: Sign Up with Email & Password
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email, password, firstname, lastname, role, avatar, username,
    }: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
      role: string;
      avatar: string;
      username: string;
    }) => signUpWithEmail(email, password, firstname, lastname, role, avatar, username),
    
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

// Function to check if vendor exists
const checkVendorExists = async (userId: string) => {
  const result = await getByFilters("vendors", [
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
    
    // Check if user exists in vendors collection
    const vendorExists = await checkVendorExists(user.uid);
    
    if (!vendorExists) {
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
        'user'
      );
    }
    
    // Fetch and save vendor data
    const vendorData = await fetchVendorData(user.uid);
    saveVendorToStorage(vendorData);
    
    return { user, vendorData };
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
      console.log("Vendor data:", data.vendorData);
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
    localStorage.removeItem('vendorData'); // Remove vendor data specifically
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