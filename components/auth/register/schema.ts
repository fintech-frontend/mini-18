import { z } from "zod";

/* Ro'yxatdan o'tish formasi validatsiyasi (/register va /registration) */
export const registrationSchema = z
  .object({
    email: z
      .string()
      .min(1, "Введите ваш email адрес")
      .email("Введите корректный email"),

    phone: z
      .string()
      .min(1, "Введите номер телефона")
      .min(10, "Введите корректный номер телефона"),

    fullName: z
      .string()
      .min(1, "Введите ваше полное имя")
      .min(2, "Имя должно содержать минимум 2 символа"),

    region: z.string().min(1, "Введите ваш регион"),

    password: z
      .string()
      .min(1, "Введите пароль")
      .min(6, "Пароль должен содержать минимум 6 символов"),

    confirmPassword: z.string().min(1, "Подтвердите пароль"),

    terms: z.boolean().refine((value) => value === true, {
      message: "Необходимо принять условия обслуживания",
    }),

    privacy: z.boolean().refine((value) => value === true, {
      message: "Необходимо согласиться с обработкой персональных данных",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const registrationDefaults: RegistrationFormData = {
  email: "",
  phone: "",
  fullName: "",
  region: "",
  password: "",
  confirmPassword: "",
  terms: false,
  privacy: false,
};
