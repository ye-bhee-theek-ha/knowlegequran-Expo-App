import { useRouter, useSegments } from 'expo-router';
import axios from 'axios';
import * as React from 'react';
import { User } from '@/constants/types';

const AuthContext = React.createContext<any>(null);

  
export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const rootSegment = useSegments()[0];
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (user === undefined) return;

    if (!user && rootSegment !== "(auth)") {
      router.replace("/(auth)/login");
    } else if (user) {

      if (user.role === "companyadmin" )
      {
        router.replace("/(admin)/(tabs)/dashboard");
      }
      else if (user.role === "student" )
      {
        router.replace("/(student)/");
      }
      else if (user.role === "teacher" )
      {
        router.replace("/(teacher)/");
      }
    }
  }, [user, rootSegment]);

  const signIn = async (email: string, password: string) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await axios.post('http://lms.knowledgequran.info/login/validate_login_app', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        });

      if (response.data.status === "success") {
        const userDetails: User = response.data.data;
        setUser(userDetails);
        return;
      } 
      else
      {
        throw new Error('Invalid email or password');
      }

    } catch (error) {

        if (error instanceof Error) {
          throw new Error(error.message || 'An error occurred during sign in.');
        } 
        else {
          throw new Error('An unknown error occurred.');
        }
      }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
