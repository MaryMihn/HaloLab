export interface City {
    id: number;
    name: string;
  }
  
  export interface DoctorSpecialty {
    id: number;
    name: string;
    params?: {
      minAge?: number;
      maxAge?: number;
      gender?: string;
    };
  }
  
  export  interface Doctor {
    id: number;
    name: string;
    surname: string;
    specialityId: number;
    isPediatrician: boolean;
    cityId: number;
  }
  
  export interface Form {
    name: string;
    birthdayDate?: string;
    sex: string;
    city: City;
    doctorSpecialty?: DoctorSpecialty;
    doctor: Doctor;
    email: string;
    phone?: string;
  }