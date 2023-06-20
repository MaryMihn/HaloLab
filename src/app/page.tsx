"use client";

import {
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  FormLabel,
  FormControl,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect, SetStateAction } from "react";
import { Controller, useForm, useController } from "react-hook-form";
import styles from "./page.module.css";
import { City, DoctorSpecialty, Doctor, Form } from "./types/insex";

export default function Home(props: any) {
  const { Component, pageProps } = props;

  const [cities, setCities] = useState<City[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSpecialties, setDoctorSpecialties] = useState<DoctorSpecialty[]>(
    []
  );
  const [doctorsTrue, setDoctorsTrue] = useState<Doctor[]>([]);
  const [doctorSpecialtiesTrue, setDoctorSpecialtiesTrue] = useState<
    DoctorSpecialty[]
  >([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | string>("");
  const [selectedCity, setSelectedCity] = useState<number | string>("");
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | string>(
    ""
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Form>();

  const sex = watch("sex");
  const phone = watch("phone");
  const city = watch("city");
  const doctorSpecialty = watch("doctorSpecialty");
  const birth = watch("birthdayDate");

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4"
        )
      ).json();
      setCities(data);
    };
    dataFetch();
  }, []);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21"
        )
      ).json();
      setDoctors(data);
      setDoctorsTrue(data);
    };
    dataFetch();
  }, []);

  useEffect(() => {
    const dataFetch = async () => {
      const data: DoctorSpecialty[] = await (
        await fetch(
          "https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca"
        )
      ).json();

      setDoctorSpecialties(data);
      setDoctorSpecialtiesTrue(data);
    };
    dataFetch();
  }, []);

  useEffect(() => {
    const doctorSpes =
      sex === "Male"
        ? doctorSpecialtiesTrue.filter((el) => el.params?.gender !== "Female")
        : sex === "Female"
        ? doctorSpecialtiesTrue.filter((el) => el.params?.gender !== "Male")
        : doctorSpecialties;

    setDoctorSpecialties(doctorSpes);
  }, [sex]);

  useEffect(() => {
    const year = birth?.split("-")[0] ?? 0;
    const age = new Date().getFullYear() - +year;

    const getDoctorsByAge = () => {
      return doctorSpecialtiesTrue.filter((doctor) => {
        if (doctor.params && (doctor.params.maxAge || doctor.params.minAge)) {
          return (
            (!doctor.params.maxAge || doctor.params.maxAge >= age) &&
            (!doctor.params.minAge || doctor.params.minAge <= age)
          );
        }
        return true;
      });
    };

    const res = getDoctorsByAge();
    setDoctorSpecialties(res);
  }, [birth]);

  useEffect(() => {
    const doctorsCity =
      doctorSpecialty && !selectedCity
        ? doctors.filter((el) => el?.cityId == city.id)
        : doctorsTrue.filter((el) => el?.cityId == city.id);
    setDoctors(doctorsCity ?? []);
  }, [city]);



  useEffect(() => {
    const doctorInSpecialty: Doctor[] = city && !selectedDoctor
      ? doctors.filter((el) => el?.specialityId === doctorSpecialty?.id)
      : doctorsTrue.filter((el) => el?.specialityId === doctorSpecialty?.id);
    setDoctors( doctorInSpecialty ?? [])
  }, [doctorSpecialty]);


  const handleCityChange = (event: {
    target: { value: SetStateAction<string | number> };
  }) => {
    const selectedCity = cities.find(
      (el) => el?.id === event.target.value
    ) as City;
    setSelectedCity(event.target.value);
    setValue("city", selectedCity);
  };

  const handleSpecialityChange = (event: {
    target: { value: SetStateAction<string | number> };
  }) => {
    const selectedSpeciality = event.target.value as number;
    const doctorSpec = doctorSpecialties.find(
      (el) => el?.id === event.target.value
    ) as DoctorSpecialty;
    setSelectedSpeciality(selectedSpeciality);
    setValue("doctorSpecialty", doctorSpec);
  };

  const handleDoctorChange = (event: {
    target: { value: SetStateAction<string | number> };
  }) => {
    const doctor = doctors.find(
      (el) => el?.id === event.target.value
    ) as Doctor;

    setSelectedDoctor(event.target.value);
    setValue("doctor", doctor);

    const findCity = cities?.find(
      (city) => city?.id === doctor?.cityId
    ) as City;
    const findSpecialty = doctorSpecialties?.find(
      (spec) => spec?.id === doctor?.specialityId
    ) as DoctorSpecialty;
    if (city && doctor) {
      setValue("doctorSpecialty", findSpecialty);
      setSelectedSpeciality(findSpecialty.id);
    }
    if (doctorSpecialty && doctor) {
      setValue("city", findCity);
      setSelectedCity(findCity.id);
    }
    if (doctor) {
      setValue("doctorSpecialty", findSpecialty, { shouldValidate: true });
      setValue("city", findCity);
      setSelectedCity(findCity.id);
      setSelectedSpeciality(findSpecialty.id);
    }
  };

  const onSubmit = (data: any) => {
    data.preventDefault();
    console.log(data, "!!!!!");
  };

  return (
    <div className={styles.app}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1>Form</h1>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Name"
              variant="outlined"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              type="text"
            />
          )}
          rules={{
            required: "Name required",
            pattern: {
              value: /^[A-Za-z\s'-]+$/,
              message: "Input can have only letters",
            },
          }}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Email"
              variant="outlined"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              type="email"
            />
          )}
          rules={{
            required: phone ? false : "Email required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Email is not valid.",
            },
          }}
        />{" "}
        <Controller
          control={control}
          name="phone"
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Phone Number"
              variant="outlined"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              type="tel"
            />
          )}
          rules={{
            required: false,
            pattern: {
              value: /^\+?[1-9][0-9]{7,14}$/,
              message: "Input can have only Number longer than 8 ",
            },
          }}
        />
        <Controller
          name="birthdayDate"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              label="Birthday Date"
              variant="outlined"
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? error.message : null}
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          )}
          rules={{
            required: "Birthday Date is required",
          }}
        />{" "}
        <Controller
          name="sex"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                value={value}
                onChange={onChange}
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </>
          )}
          rules={{ required: "Sex is required" }}
        />{" "}
        <FormControl>
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={selectedCity}
            onChange={handleCityChange}
            required
          >
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="speciality-label">Speciality</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={selectedSpeciality}
            onChange={handleSpecialityChange}
          >
            {doctorSpecialties.map((speciality) => (
              <MenuItem key={speciality.id} value={speciality.id}>
                {speciality.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="doctor-label">Doctor</InputLabel>
          <Select
            labelId="doctor-label"
            id="doctor-field"
            value={selectedDoctor}
            onChange={handleDoctorChange}
            required
          >
            {doctors?.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor?.name + " " + doctor?.surname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="outlined" size="large">
          Submit
        </Button>
      </form>
    </div>
  );
}
