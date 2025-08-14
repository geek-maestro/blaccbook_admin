import { addDoc, collection, doc, getDocs, query, updateDoc, where, WhereFilterOp, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface IFilters {
   key: string;
   operator: WhereFilterOp;
   value: string
}

const getAll = async (collectionPath: string) => {
    const result: { data: any[], error: string } = { data: [], error: "" };
    try {
        const snapshot = await getDocs(collection(db, collectionPath));
        snapshot.forEach((docSnap) => {
            result.data.push({ id: docSnap.id, ...docSnap.data() });
        });
        return result;
    } catch (err) {
        result.error = err instanceof Error ? err.message : 'Unknown error occurred';
        return result;
    }
}

const put = async (collectionPath: string, docId: string, object: Record<string, any>) => {
    const result = { success: false, error: "" };
    if (!docId) {
        result.error = "Document ID is required.";
        return result;
    }
    try {
        await setDoc(doc(db, collectionPath, docId), object);
        result.success = true;
        return result;
    } catch (err) {
        result.error = err instanceof Error ? err.message : 'Unknown error occurred';
        return result;
    }
}

const post = async (collectionPath: string, object: Record<string, any>) => {
    // Remove id if it exists in the object
    if ('id' in object) {
        delete object.id;
    }
    
    const result = { objectId: "", error: "" };
    
    return addDoc(collection(db, collectionPath), object)
        .then((docRef) => {
            result.objectId = docRef.id;
            return result;
        })
        .catch((err) => {
            result.error = err instanceof Error ? err.message : 'Unknown error occurred';
            return result;
        });
}


const getByFilters = async (collectionPath: string, filters: IFilters[]) => {
    const result: { data: any[], error: string } = { data: [], error: "" };
    
    const whereConditions = filters.map(filter => 
        where(filter.key, filter.operator, filter.value)
    );
    
    const q = query(collection(db, collectionPath), ...whereConditions);
    
    return getDocs(q)
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                result.data.push({ id: doc.id, ...doc.data() });
            });
            return result;
        })
        .catch((err) => {
            result.error = err instanceof Error ? err.message : 'Unknown error occurred';
            return result;
        });
}

const update = async (collectionPath: string, docId: string, updatedData: Partial<Record<string, any>>) => {
    const result = { success: false, error: "" };

    if (!docId) {
        result.error = "Document ID is required.";
        return result;
    }

    return updateDoc(doc(db, collectionPath, docId), updatedData)
        .then(() => {
            result.success = true;
            return result;
        })
        .catch((err) => {
            result.error = err instanceof Error ? err.message : "Unknown error occurred";
            return result;
        });
};

const getById = async (collectionPath: string, docId: string) => {
    const result: { data: any | null, error: string } = { data: null, error: "" };
    
    if (!docId) {
        result.error = "Document ID is required.";
        return result;
    }
    
    return getDoc(doc(db, collectionPath, docId))
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                result.data = { id: docSnapshot.id, ...docSnapshot.data() };
            }
            return result;
        })
        .catch((err) => {
            result.error = err instanceof Error ? err.message : 'Unknown error occurred';
            return result;
        });
}

const remove = async (collectionPath: string, docId: string) => {
    const result = { success: false, error: "" };
    if (!docId) {
        result.error = "Document ID is required.";
        return result;
    }
    try {
        await deleteDoc(doc(db, collectionPath, docId));
        result.success = true;
        return result;
    } catch (err) {
        result.error = err instanceof Error ? err.message : 'Unknown error occurred';
        return result;
    }
}

export { post, getByFilters, getAll, put, update, getById, remove };
