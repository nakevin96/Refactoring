import htmlStatement from "./statement.js";
fetch("./invoices.json")
  .then((r) => r.json())
  .then((d) => {
    const invoiceData = d;
    fetch("./plays.json")
      .then((r) => r.json())
      .then((d) => {
        const playData = d;
        document.getElementById("root").innerHTML = htmlStatement(
          invoiceData[0],
          playData
        );
      });
  });
