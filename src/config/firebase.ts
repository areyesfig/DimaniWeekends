import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { API_KEY } from '@env';

// Configuración de Firebase para DimaniWeekends
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'dimaniweekends-app.firebaseapp.com',
  projectId: 'dimaniweekends-app',
  storageBucket: 'dimaniweekends-app.firebasestorage.app',
  messagingSenderId: '859589513015',
  appId: '1:859589513015:android:7364399678e8028512d4b2',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancias de Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 