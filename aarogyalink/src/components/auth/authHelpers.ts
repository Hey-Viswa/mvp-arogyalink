import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleUserRedirect = async (user: User, router: AppRouterInstance) => {
  if (!user) return;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    const role = userData.role;
    router.push(role === "patient" ? "/patient/dashboard" : "/doctor/dashboard");
  } else {
    // If user doesn't exist, create a new entry
    const newUser = {
      uid: user.uid,
      email: user.email,
      phone: user.phoneNumber,
      role: "patient", // default role
    };
    await setDoc(docRef, newUser);
    router.push("/patient/dashboard");
  }
};
