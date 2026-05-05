import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'visitor' | 'admin';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('user_role') as Role) || 'visitor';
  });

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('user_role', newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole: handleSetRole, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
