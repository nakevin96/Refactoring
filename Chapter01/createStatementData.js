const createStatementData = (invoice, plays) => {
  const totalAmount = (data) =>
    data.performances.reduce((total, p) => total + p.amount, 0);
  const totalVolumeCredits = (data) =>
    data.performances.reduce((total, p) => total + p.volumeCredits, 0);

  const playFor = (aPerformance) => plays[aPerformance.playID];

  const amountFor = (aPerformance) => {
    // 값이 변하지 않는 변수는 매개변수로 전달한다.
    let result = 0; // 변수를 초기화하는 코드

    switch (aPerformance.play.type) {
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

  const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  };

  const enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  };

  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
};

export default createStatementData;
