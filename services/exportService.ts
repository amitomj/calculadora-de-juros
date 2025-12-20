
import { CalculationResult, InterestType } from '../types';

export const exportToWord = (results: CalculationResult[], type: InterestType, finalDate: string) => {
  const typeLabels: Record<InterestType, string> = {
    [InterestType.COMMERCIAL_3]: 'Comerciais (§3)',
    [InterestType.COMMERCIAL_5]: 'Comerciais (§5)',
    [InterestType.CIVIL]: 'Civis',
    [InterestType.STATE]: 'Estado e Entidades Públicas'
  };

  let htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Calibri, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .summary { font-weight: bold; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <h1>Relatório de Juros de Mora - ${typeLabels[type]}</h1>
        <p>Data de Referência para Cálculo: ${new Date(finalDate).toLocaleDateString('pt-PT')}</p>
  `;

  let grandTotalDebt = 0;
  let grandTotalInterest = 0;

  results.forEach((res, index) => {
    grandTotalDebt += res.debt.value;
    grandTotalInterest += res.totalInterest;

    htmlContent += `
      <h3>Dívida #${index + 1}</h3>
      <table>
        <thead>
          <tr>
            <th>Valor Capital</th>
            <th>Vencimento</th>
            <th>Período</th>
            <th>Taxa (%)</th>
            <th>Dias</th>
            <th>Juros</th>
          </tr>
        </thead>
        <tbody>
    `;

    res.periods.forEach(p => {
      htmlContent += `
        <tr>
          <td>${res.debt.value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
          <td>${new Date(res.debt.dueDate).toLocaleDateString('pt-PT')}</td>
          <td>${p.start.toLocaleDateString('pt-PT')} a ${p.end.toLocaleDateString('pt-PT')}</td>
          <td>${p.rate.toFixed(2)}%</td>
          <td>${p.days}</td>
          <td>${p.interest.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="5">Sub-Total Juros</td>
            <td>${res.totalInterest.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td colspan="5">Total (Capital + Juros)</td>
            <td>${res.totalValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
          </tr>
        </tfoot>
      </table>
    `;
  });

  htmlContent += `
    <hr />
    <div class="summary">
      <p>Total Capital: ${grandTotalDebt.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
      <p>Total Juros: ${grandTotalInterest.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
      <p>TOTAL GLOBAL: ${(grandTotalDebt + grandTotalInterest).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
    </div>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Relatorio_Juros_Mora.doc';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
