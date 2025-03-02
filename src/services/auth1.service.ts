import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithCredential, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { post } from "@/lib/firestoreCrud";

// Function to sign in with credentials
const credSignIn = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

// Custom Hook: Sign in with Email & Password
export const useCredSignIn = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      credSignIn(email, password),
    onSuccess: (user) => {
      console.log("Signed in:", user);
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
  role: string
) => {
  return post("vendors", {
    email,
    userId,
    firstname,
    lastname,
    username,
    avatar,
    role,
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

// Function to sign in with Google
const socialLogin = async (token: string) => {
  const credential = GoogleAuthProvider.credential(token);
  const userCredential = await signInWithCredential(auth, credential);
  const user = userCredential.user;

  if (!user.email) throw new Error("Email is required for registration");

  const nameParts = user.displayName?.split(" ") || ["", ""];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const username = user.email.split("@")[0];

  await createProfile(user.email, user.uid, firstName, lastName, username, user.photoURL || "", "vendors");

  return user.uid;
};

// Custom Hook: Google Sign-In
export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => socialLogin(token),

    onSuccess: (userId) => {
      console.log("Google Sign-In Success:", userId);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      throw new Error(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    },
  });
};
