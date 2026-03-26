import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// GET → obtener productos
export async function GET() {
  const ref = collection(db, "productos");
  const snapshot = await getDocs(ref);

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return Response.json(data);
}

// POST → guardar producto
export async function POST(req) {
  const body = await req.json();
  const ref = collection(db, "productos");

  await addDoc(ref, body);

  return Response.json({ ok: true });
}