export const emptyInputs = () => {
  const allInputs = document.querySelectorAll("input");
  if (allInputs && allInputs.length) {
    allInputs.forEach((item, index) => {
      item.value = "";
    });
  }
};
