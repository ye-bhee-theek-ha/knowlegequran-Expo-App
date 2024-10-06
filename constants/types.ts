// types.ts

export interface Student {
    student_code: string;
    student_name: string;
    gender: string;
    fhm_name: string;
    father_number: string | null;
    email: string;
    password: string;
    dob: string;
    class_start: string;
    class_end: string;
    enroll_date: string;
    language: string;
    country: string;
    site: string;
    teacher_code: string;
    status: string;
    fees_key: string;
    fees_id: string;
    paid_fees_month: string | null;
    timezone: string;
    class_days?: string;
  }

  export interface Teacher {
    teacher_code: string;
    name: string;
    gender: string;
    fhm_name: string;
    cnic: string;
    experience: string;
    language: string;
    dob: string;
    qualification: string;
    subjects: string;
    city: string;
    teacher_contact: string;
    emergency_contact: string;
    email: string;
    password: string;
    teacher: any;
  }
  
  export interface Class {
    id: string;
    title: string;
    teacher_code: string;
    student_code: string;
    start: string;
    end: string;
    status: string;
    room: string;
    salary: string | null;
    active: string;
  }
  
  export interface AppContextProps {
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    fetchData: () => void;
  }
  
  export interface User {
    name: string;
    role: string;
    user_code: string;
    user_id: string;
  }

  