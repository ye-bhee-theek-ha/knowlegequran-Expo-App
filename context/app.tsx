import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AppContextProps, Student, Teacher, Class } from '../constants/types';

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://lms.knowledgequran.info/companyadmin/get_info');
      const { students, teachers, classes } = response.data.data;

      setStudents(students);
      setTeachers(teachers);
      setClasses(classes);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ students, teachers, classes, setStudents, setTeachers, setClasses, fetchData }}>
      {children}
    </AppContext.Provider>
  );
};
