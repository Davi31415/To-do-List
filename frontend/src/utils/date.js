const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];
const date = new Date();

export const formattedDate = date.toLocaleString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "numeric",
  month: "long",
  year: "numeric",
});