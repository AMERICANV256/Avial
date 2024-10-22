import React, { useState } from "react";

//el hook retorna un objeto

export const useForm = (initialObj = {}) => {
  const [form, setForm] = useState(initialObj);
  const changed = ({ target }) => {
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return { form, changed };
};
