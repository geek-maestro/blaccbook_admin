import { auth } from "@/lib/firebaseConfig";
import { IProfile } from "@/types/profile";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider,
    signInWithCredential,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { getByFilters, IFilter, post } from "./firestoreCRUD";


const getAuthError = (error: any) => {
    console.log(error.message)
    let serverError = "Authentication failed. Try again";
    switch (error.message) {
        case "Firebase: Error (auth/invalid-email).":
            serverError = "Please enter a valid email";
            break;

        case "Firebase: Error (auth/invalid-credential).":
            serverError = "Email or password is wrong. Check and try again."
            break;

        case "Firebase: Error (auth/email-already-in-use).":
            serverError = "Email already in use. Try logging in or use a differnt email."
            break;

        case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            serverError = "Password should be at least 6 characters."
            break;

        case "Firebase: Error (auth/too-many-requests).":
            serverError = "Too many failed attempts. Try again in 5 mins."
            break;
    
        default:
            break;
    }

    return serverError;
}

export const signInWithCredentials = async (email: string, password: string) => {
    const res: {userId: string, serverError: string} = {userId: "", serverError: ""};
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        res.userId = response.user.uid;
        const _profile = await getProfileByEmail(email);
        AsyncStorage.setItem("userProfile", JSON.stringify(_profile));
    } catch (error: any) {
        res.serverError = getAuthError(error);
    }
    return res;
}

export const createAccountWithCredentials = async (email: string, password: string, firstname: string, lastname: string) => {
    const res: {userId: string, serverError: string} = {userId: "", serverError: ""};
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        res.userId = response.user.uid;
        const profileRes = await createProfile(email, res.userId, firstname, lastname);

        if (profileRes.res.error) {
            response.user.delete();
            res.serverError = "Account creation failed. Try again";
        } else {
            const _profile = {...profileRes.profile, id: profileRes.res.objectId}
            AsyncStorage.setItem("userProfile", JSON.stringify(_profile))
        }
    } catch (error: any) {
        res.serverError = getAuthError(error);
    }
    return res;
}

export const providerLogin = async (idToken: string) => {
    const res: { userId: string; serverError: string } = { userId: "", serverError: "" };

    try {
        console.log("Google Auth Request Configured");

        // Create a Google Auth credential using the ID token
        const credential = GoogleAuthProvider.credential(idToken);

        // Sign in to Firebase with the credential
        const firebaseResult = await signInWithCredential(auth, credential);

        const user = firebaseResult.user;
        // Extract the user ID
        res.userId = user.uid;

        let _profile: IProfile = await getProfileByEmail(user.email as string);

        if (!_profile) {
            // Split the display name at the first space
            const [firstname, ...lastnameParts] = (user.displayName || "").split(" ");
            const lastname = lastnameParts.join(" ");

            const profileRes = await createProfile(user.email as string, res.userId, firstname, lastname);

            if (profileRes.res.error) {
                user.delete();
                res.serverError = "Account creation failed. Try again";
            } else {
                const newProfile = {...profileRes.profile, id: profileRes.res.objectId}
                AsyncStorage.setItem("userProfile", JSON.stringify(newProfile))
            }
        } else {
            AsyncStorage.setItem("userProfile", JSON.stringify(_profile))
        }

        // Log the user info (optional)
        console.log("User Info:", firebaseResult.user);
    } catch (error: any) {
        console.error("Error during Google Sign-In:", error);
        res.serverError = "An error occurred. Please try again.";
    }

    return res;
};

export const createProfile = async (email: string, userId: string, firstname: string, lastname: string) => {
    const profile: IProfile = {
        id: "",
        createdAt: Date.now().toString(),
        userId: userId,
        email,
        firstname,
        lastname,
        verications: {
            email: false,
            telephone: false
        }
    }
    const res = await post("profiles", {...profile});
    return {res, profile};
}


export const getProfileByEmail = async (email: string) => {
    const filters: IFilter[] = [{ key: "email", operator: "==", value: email }];
    const res = await getByFilters("profiles", filters);
    return res.data.length > 0 ? res.data[0] : null;
}

export const logout = async () => {
    await signOut(auth);
}

export const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
}