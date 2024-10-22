export const soloNumeros = (e) => {
  const { name, value } = e.target;

  const numericValue = value.replace(/\D/g, "");

  const newEvent = {
    target: {
      name,
      value: numericValue,
    },
  };

  return newEvent;
};
