const invoiceData = require("./invoices.json");
const playData = require("./plays.json");

function statement(invoice, plays) {
  const totalAmount = () => {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  };
  const totalVolumeCredits = () => {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  };
  const usd = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  };
  const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  };
  const playFor = (aPerformance) => plays[aPerformance.playID];
  const amountFor = (aPerformance) => {
    // 값이 변하지 않는 변수는 매개변수로 전달한다.
    let result = 0; // 변수를 초기화하는 코드

    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  };

  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    //청구내역 출력
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    })석\n`;
  }
  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
}

console.log(statement(invoiceData[0], playData));
