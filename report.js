// LeaseScore Comprehensive Report Generator

// Get data from localStorage
function getReportData() {
    const storedData = localStorage.getItem('leaseReportData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    alert('No report data found. Please calculate first.');
    window.close();
    return null;
}

// Format currency
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate additional advanced metrics
function calculateAdvancedMetrics(calc, values) {
    const advanced = {};
    
    // Effective interest rate (considering all costs)
    advanced.effectiveAPR = ((calc.totalCost - values.negotiatedPrice + values.tradeInValue) / (values.negotiatedPrice - values.tradeInValue)) / (values.leaseTerm / 12) * 100;
    
    // Cost per mile (assuming 12k miles/year)
    const estimatedMiles = (values.leaseTerm / 12) * 12000;
    advanced.costPerMile = calc.totalCost / estimatedMiles;
    
    // Monthly cost as percentage of vehicle value
    advanced.monthlyCostPercent = (calc.totalMonthlyPayment / values.negotiatedPrice) * 100;
    
    // Depreciation rate
    advanced.depreciationRate = ((values.negotiatedPrice - calc.residual) / values.negotiatedPrice) * 100;
    advanced.annualDepreciationRate = (advanced.depreciationRate / values.leaseTerm) * 12;
    
    // Interest to depreciation ratio
    advanced.interestToDepreciationRatio = calc.totalInterest / calc.totalDepreciation;
    
    // Upfront cost burden
    advanced.upfrontCost = values.downPayment + values.upfrontTax + values.acquisitionFee;
    advanced.upfrontToTotalRatio = (advanced.upfrontCost / calc.totalCost) * 100;
    
    // Monthly payment efficiency
    advanced.paymentEfficiency = (calc.monthlyDepreciation / calc.totalMonthlyPayment) * 100;
    
    // Residual value strength
    advanced.residualStrength = (calc.residual / values.msrp) * 100;
    
    // Discount effectiveness
    advanced.discountEffectiveness = calc.savingsPercentage / calc.paymentToMSRPRatio;
    
    // Tax burden
    advanced.totalTaxPaid = (calc.monthlyTax * values.leaseTerm) + values.upfrontTax;
    advanced.taxBurdenPercent = (advanced.totalTaxPaid / calc.totalCost) * 100;
    
    // Money factor quality (compared to typical 0.00250)
    const typicalMF = 0.00250;
    advanced.mfQuality = ((typicalMF - values.moneyFactor) / typicalMF) * 100;
    
    // Deal velocity (how quickly you're paying off the car)
    advanced.dealVelocity = (calc.totalDepreciation / values.negotiatedPrice) * 100;
    
    // Cost to own ratio
    advanced.costToOwnRatio = (calc.costToOwnAfterLease / values.msrp) * 100;
    
    return advanced;
}

// Calculate market benchmarks
function calculateMarketBenchmarks(calc, values, advanced) {
    const benchmarks = {};
    
    // Typical market values
    const typicalPaymentRatio = 1.0; // 1% rule
    const typicalDiscount = 7.0; // 7% off MSRP
    const typicalResidual = 60.0; // 60% residual
    const typicalAPR = 6.0; // 6% APR
    const typicalDownPayment = 0; // $0 down
    
    // Calculate deviations from market
    benchmarks.paymentVsMarket = calc.paymentToMSRPRatio - typicalPaymentRatio;
    benchmarks.discountVsMarket = calc.savingsPercentage - typicalDiscount;
    benchmarks.residualVsMarket = calc.residualPercent - typicalResidual;
    benchmarks.aprVsMarket = values.apr - typicalAPR;
    benchmarks.downPaymentVsMarket = values.downPayment - typicalDownPayment;
    
    // Market position score (0-100)
    let marketScore = 50; // Start at neutral
    
    if (calc.paymentToMSRPRatio <= 0.8) marketScore += 15;
    else if (calc.paymentToMSRPRatio <= 1.0) marketScore += 10;
    else if (calc.paymentToMSRPRatio > 1.5) marketScore -= 15;
    
    if (calc.savingsPercentage >= 10) marketScore += 15;
    else if (calc.savingsPercentage >= 7) marketScore += 10;
    else if (calc.savingsPercentage < 3) marketScore -= 10;
    
    if (values.downPayment === 0) marketScore += 10;
    else if (values.downPayment > values.msrp * 0.05) marketScore -= 10;
    
    if (values.apr < 4) marketScore += 10;
    else if (values.apr > 8) marketScore -= 10;
    
    benchmarks.marketPositionScore = Math.max(0, Math.min(100, marketScore));
    
    return benchmarks;
}

// Calculate risk factors
function calculateRiskFactors(calc, values, advanced) {
    const risks = [];
    
    // High down payment risk
    if (values.downPayment > values.msrp * 0.05) {
        const riskAmount = values.downPayment;
        risks.push({
            category: 'Financial Risk',
            level: values.downPayment > values.msrp * 0.10 ? 'high' : 'medium',
            title: 'High Down Payment Risk',
            description: `You have $${riskAmount.toLocaleString()} at risk. If the vehicle is totaled or stolen, you lose this money.`,
            impact: 'High',
            recommendation: 'Consider reducing down payment to $0 and keeping cash for emergencies.'
        });
    }
    
    // High payment ratio risk
    if (calc.paymentToMSRPRatio > 1.2) {
        risks.push({
            category: 'Deal Quality',
            level: calc.paymentToMSRPRatio > 1.5 ? 'high' : 'medium',
            title: 'Above-Market Payment',
            description: `Your payment is ${calc.paymentToMSRPRatio.toFixed(2)}% of MSRP, significantly above the 1% rule benchmark.`,
            impact: 'High',
            recommendation: 'Negotiate a lower monthly payment or consider a different vehicle.'
        });
    }
    
    // Poor negotiation risk
    if (calc.savingsPercentage < 3) {
        risks.push({
            category: 'Negotiation',
            level: calc.savingsPercentage < 0 ? 'high' : 'medium',
            title: 'Weak Negotiation Position',
            description: `Only ${calc.savingsPercentage.toFixed(1)}% discount from MSRP. You're leaving money on the table.`,
            impact: 'Medium',
            recommendation: 'Negotiate the selling price more aggressively before finalizing.'
        });
    }
    
    // High interest rate risk
    if (values.apr > 7) {
        risks.push({
            category: 'Interest Rate',
            level: values.apr > 9 ? 'high' : 'medium',
            title: 'Above-Market Interest Rate',
            description: `APR of ${values.apr.toFixed(2)}% is higher than typical market rates (5-7%).`,
            impact: 'Medium',
            recommendation: 'Shop around for better rates or improve credit score before leasing.'
        });
    }
    
    // Low residual risk
    if (calc.residualPercent < 50) {
        risks.push({
            category: 'Depreciation',
            level: calc.residualPercent < 40 ? 'high' : 'medium',
            title: 'High Depreciation Rate',
            description: `Residual of ${calc.residualPercent.toFixed(1)}% means you're paying for ${(100 - calc.residualPercent).toFixed(1)}% of the car's value.`,
            impact: 'High',
            recommendation: 'Consider vehicles with higher residual values to reduce monthly payments.'
        });
    }
    
    // Mileage risk (if applicable)
    const estimatedMiles = (values.leaseTerm / 12) * 12000;
    if (estimatedMiles > 36000) {
        risks.push({
            category: 'Usage',
            level: 'medium',
            title: 'Potential Mileage Overage',
            description: `Standard 12k miles/year over ${values.leaseTerm} months = ${estimatedMiles.toLocaleString()} miles. Verify your mileage allowance.`,
            impact: 'Medium',
            recommendation: 'Negotiate higher mileage allowance if you drive more than 12k miles/year.'
        });
    }
    
    // Cost to own risk
    if (advanced.costToOwnRatio > 120) {
        risks.push({
            category: 'Long-term Cost',
            level: 'medium',
            title: 'High Cost-to-Own',
            description: `Total cost to own (${advanced.costToOwnRatio.toFixed(0)}% of MSRP) is high. Buying might be more economical.`,
            impact: 'Medium',
            recommendation: 'Compare with financing options before committing to lease.'
        });
    }
    
    return risks;
}

// Calculate optimization opportunities
function calculateOptimizations(calc, values, advanced, benchmarks) {
    const optimizations = [];
    
    // Payment optimization
    if (calc.paymentToMSRPRatio > 1.0) {
        const targetPayment = values.msrp * 0.01;
        const potentialSavings = (calc.totalMonthlyPayment - targetPayment) * values.leaseTerm;
        optimizations.push({
            category: 'Payment Reduction',
            title: 'Achieve 1% Rule Target',
            current: formatCurrency(calc.totalMonthlyPayment),
            target: formatCurrency(targetPayment),
            savings: formatCurrency(potentialSavings),
            description: `Reducing your monthly payment to ${formatCurrency(targetPayment)} would save you ${formatCurrency(potentialSavings)} over the lease term.`,
            actions: [
                'Negotiate a lower selling price',
                'Increase down payment (if comfortable with risk)',
                'Extend lease term to 48 months',
                'Look for manufacturer incentives'
            ]
        });
    }
    
    // Negotiation optimization
    if (calc.savingsPercentage < 7) {
        const targetDiscount = values.msrp * 0.07;
        const currentDiscount = calc.savingsFromMSRP;
        const additionalSavings = targetDiscount - currentDiscount;
        optimizations.push({
            category: 'Price Negotiation',
            title: 'Improve Negotiation Discount',
            current: `${calc.savingsPercentage.toFixed(1)}% (${formatCurrency(currentDiscount)})`,
            target: `7.0% (${formatCurrency(targetDiscount)})`,
            savings: formatCurrency(additionalSavings),
            description: `Negotiating to a 7% discount would save you an additional ${formatCurrency(additionalSavings)} on the selling price.`,
            actions: [
                'Get quotes from multiple dealers',
                'Time purchase for end of month/quarter',
                'Research dealer invoice price',
                'Negotiate selling price, not monthly payment'
            ]
        });
    }
    
    // Down payment optimization
    if (values.downPayment > 0) {
        const monthlyIncrease = (values.downPayment / values.leaseTerm);
        optimizations.push({
            category: 'Down Payment',
            title: 'Eliminate Down Payment Risk',
            current: formatCurrency(values.downPayment),
            target: '$0',
            savings: `Protect ${formatCurrency(values.downPayment)} from loss`,
            description: `Removing down payment increases monthly payment by ~${formatCurrency(monthlyIncrease)} but eliminates risk of losing ${formatCurrency(values.downPayment)} if car is totaled.`,
            actions: [
                'Roll down payment into monthly payments',
                'Keep cash for emergency fund',
                'Invest the money instead (potential returns)',
                'Maintain liquidity for better opportunities'
            ]
        });
    }
    
    // Interest rate optimization
    if (values.apr > 6) {
        const targetAPR = 5.5;
        const targetMF = targetAPR / 2400;
        const currentMonthlyInterest = calc.monthlyInterest;
        const targetMonthlyInterest = (values.negotiatedPrice - values.tradeInValue + calc.residual) * targetMF;
        const monthlySavings = currentMonthlyInterest - targetMonthlyInterest;
        const totalSavings = monthlySavings * values.leaseTerm;
        
        optimizations.push({
            category: 'Interest Rate',
            title: 'Secure Better Interest Rate',
            current: `${values.apr.toFixed(2)}% APR`,
            target: `${targetAPR.toFixed(2)}% APR`,
            savings: formatCurrency(totalSavings),
            description: `Reducing APR to ${targetAPR}% would save ${formatCurrency(totalSavings)} in interest over the lease term.`,
            actions: [
                'Improve credit score before applying',
                'Shop multiple lenders/banks',
                'Consider credit union financing',
                'Negotiate money factor with dealer'
            ]
        });
    }
    
    return optimizations;
}

// Initialize report
document.addEventListener('DOMContentLoaded', function() {
    const data = getReportData();
    if (!data) return;
    
    const { calc, values } = data;
    
    // Calculate advanced metrics
    const advanced = calculateAdvancedMetrics(calc, values);
    const benchmarks = calculateMarketBenchmarks(calc, values, advanced);
    const risks = calculateRiskFactors(calc, values, advanced);
    const optimizations = calculateOptimizations(calc, values, advanced, benchmarks);
    
    // Set date and ID
    document.getElementById('reportDate').textContent = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Populate all pages
    populatePage1(calc, values, advanced);
    populatePage2(calc, values, advanced);
    populatePage3(calc, values, advanced);
    populatePage4(calc, values, advanced, benchmarks);
    populatePage5(calc, values, advanced, benchmarks, risks);
    populatePage6(calc, values, optimizations, risks);
    populatePage7(calc, values);
});

// PAGE 1: Executive Summary
function populatePage1(calc, values, advanced) {
    // Deal Banner
    const banner = document.getElementById('dealBanner');
    const rating = document.getElementById('dealRating');
    const score = document.getElementById('dealScore');
    
    banner.className = 'deal-banner ' + calc.dealClass;
    rating.textContent = calc.dealRating;
    score.textContent = `Overall Score: ${calc.score.toFixed(1)} / 4.0`;
    
    // Summary Grid
    const summaryGrid = document.getElementById('summaryGrid');
    const cards = [
        {
            title: 'Monthly Payment',
            value: formatCurrency(calc.totalMonthlyPayment),
            detail: `${calc.paymentToMSRPRatio.toFixed(2)}% of MSRP`
        },
        {
            title: 'Total Lease Cost',
            value: formatCurrency(calc.totalCost),
            detail: `Over ${values.leaseTerm} months`
        },
        {
            title: 'Savings from MSRP',
            value: formatCurrency(calc.savingsFromMSRP),
            detail: `${calc.savingsPercentage.toFixed(1)}% discount`
        },
        {
            title: 'Cost Per Mile',
            value: formatCurrency(advanced.costPerMile),
            detail: 'Based on 12k miles/year'
        },
        {
            title: 'Effective APR',
            value: `${advanced.effectiveAPR.toFixed(2)}%`,
            detail: 'Including all costs'
        },
        {
            title: 'Depreciation Rate',
            value: `${advanced.depreciationRate.toFixed(1)}%`,
            detail: `${advanced.annualDepreciationRate.toFixed(1)}% annually`
        },
        {
            title: 'Upfront Cost',
            value: formatCurrency(advanced.upfrontCost),
            detail: `${advanced.upfrontToTotalRatio.toFixed(1)}% of total`
        },
        {
            title: 'Cost to Own',
            value: formatCurrency(calc.costToOwnAfterLease),
            detail: `${advanced.costToOwnRatio.toFixed(0)}% of MSRP`
        }
    ];
    
    summaryGrid.innerHTML = cards.map(card => `
        <div class="summary-card">
            <h3>${card.title}</h3>
            <div class="value">${card.value}</div>
            <div class="label">${card.detail}</div>
        </div>
    `).join('');
    
    // Scoring Breakdown - Enhanced with more factors
    const scoringBars = document.getElementById('scoringBars');
    const bars = [
        {
            title: '1% Rule Compliance',
            score: calc.onePercentScore,
            max: 1.5,
            status: calc.onePercentStatus,
            detail: `${calc.paymentToMSRPRatio.toFixed(2)}% of MSRP`
        },
        {
            title: 'Down Payment Strategy',
            score: calc.downPaymentScore,
            max: 1.0,
            status: calc.downPaymentStatus,
            detail: formatCurrency(values.downPayment)
        },
        {
            title: 'Price Negotiation',
            score: calc.negotiationScore,
            max: 1.5,
            status: calc.negotiationStatus,
            detail: `${calc.savingsPercentage.toFixed(1)}% off MSRP`
        }
    ];
    
    scoringBars.innerHTML = bars.map(bar => {
        const percentage = (bar.score / bar.max) * 100;
        return `
            <div class="score-bar">
                <div class="score-bar-header">
                    <span class="score-bar-title">${bar.title}: ${bar.status}</span>
                    <span class="score-bar-value">${bar.score.toFixed(1)} / ${bar.max.toFixed(1)} pts</span>
                </div>
                <div class="score-bar-detail">${bar.detail}</div>
                <div class="score-bar-track">
                    <div class="score-bar-fill" style="width: ${percentage}%">
                        ${percentage.toFixed(0)}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Insights
    const insightsGrid = document.getElementById('insightsGrid');
    insightsGrid.innerHTML = calc.insights.map(insight => {
        const icons = {
            'excellent': '✓',
            'good': '✓',
            'info': 'ℹ',
            'warning': '⚠',
            'critical': '✗'
        };
        
        return `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">${icons[insight.type]}</div>
                <div class="insight-text">${insight.message}</div>
            </div>
        `;
    }).join('');
}

// Continue in next message due to length...

// PAGE 2: Detailed Financial Analysis
function populatePage2(calc, values, advanced) {
    // Monthly Breakdown
    const monthlyBreakdown = document.getElementById('monthlyBreakdown');
    const items = [
        {
            title: 'Depreciation',
            amount: calc.monthlyDepreciation,
            percentage: (calc.monthlyDepreciation / calc.totalMonthlyPayment) * 100
        },
        {
            title: 'Interest/Finance',
            amount: calc.monthlyInterest,
            percentage: (calc.monthlyInterest / calc.totalMonthlyPayment) * 100
        },
        {
            title: 'Sales Tax',
            amount: calc.monthlyTax,
            percentage: (calc.monthlyTax / calc.totalMonthlyPayment) * 100
        }
    ];
    
    monthlyBreakdown.innerHTML = items.map(item => `
        <div class="breakdown-item">
            <h4>${item.title}</h4>
            <div class="amount">${formatCurrency(item.amount)}</div>
            <div class="percentage">${item.percentage.toFixed(1)}% of payment</div>
        </div>
    `).join('');
    
    // Cost Table
    const costTable = document.getElementById('costTable');
    costTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Cost Component</th>
                    <th>Amount</th>
                    <th>% of Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Down Payment</td>
                    <td>${formatCurrency(values.downPayment)}</td>
                    <td>${((values.downPayment / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Upfront Tax</td>
                    <td>${formatCurrency(values.upfrontTax)}</td>
                    <td>${((values.upfrontTax / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Acquisition Fee</td>
                    <td>${formatCurrency(values.acquisitionFee)}</td>
                    <td>${((values.acquisitionFee / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Monthly Payments (${values.leaseTerm} months)</td>
                    <td>${formatCurrency(calc.totalPayments)}</td>
                    <td>${((calc.totalPayments / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;• Depreciation</td>
                    <td>${formatCurrency(calc.totalDepreciation)}</td>
                    <td>${((calc.totalDepreciation / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;• Interest</td>
                    <td>${formatCurrency(calc.totalInterest)}</td>
                    <td>${((calc.totalInterest / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>&nbsp;&nbsp;• Sales Tax</td>
                    <td>${formatCurrency(calc.monthlyTax * values.leaseTerm)}</td>
                    <td>${((calc.monthlyTax * values.leaseTerm / calc.totalCost) * 100).toFixed(1)}%</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Lease Cost</strong></td>
                    <td><strong>${formatCurrency(calc.totalCost)}</strong></td>
                    <td><strong>100.0%</strong></td>
                </tr>
                <tr>
                    <td>Residual Value (to purchase)</td>
                    <td>${formatCurrency(calc.residual)}</td>
                    <td>-</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Cost to Own After Lease</strong></td>
                    <td><strong>${formatCurrency(calc.costToOwnAfterLease)}</strong></td>
                    <td><strong>${advanced.costToOwnRatio.toFixed(1)}% of MSRP</strong></td>
                </tr>
            </tbody>
        </table>
    `;
    
    // Financial Metrics
    const financialMetrics = document.getElementById('financialMetrics');
    const metrics = [
        {
            label: 'Payment Efficiency',
            value: `${advanced.paymentEfficiency.toFixed(1)}%`,
            description: 'Portion of payment going to depreciation vs interest/tax'
        },
        {
            label: 'Interest-to-Depreciation Ratio',
            value: advanced.interestToDepreciationRatio.toFixed(3),
            description: 'Lower is better - shows interest burden'
        },
        {
            label: 'Monthly Cost % of Value',
            value: `${advanced.monthlyCostPercent.toFixed(2)}%`,
            description: 'Monthly payment as % of vehicle value'
        },
        {
            label: 'Tax Burden',
            value: `${advanced.taxBurdenPercent.toFixed(1)}%`,
            description: `Total tax: ${formatCurrency(advanced.totalTaxPaid)}`
        },
        {
            label: 'Residual Strength',
            value: `${advanced.residualStrength.toFixed(1)}%`,
            description: 'Residual as % of MSRP - higher is better'
        },
        {
            label: 'Deal Velocity',
            value: `${advanced.dealVelocity.toFixed(1)}%`,
            description: 'How much of car value you\'re paying for'
        }
    ];
    
    financialMetrics.innerHTML = metrics.map(metric => `
        <div class="metric-card">
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
            <div class="metric-description">${metric.description}</div>
        </div>
    `).join('');
}

// PAGE 3: Lease vs Buy Comparison
function populatePage3(calc, values, advanced) {
    // Comparison Grid
    const comparisonGrid = document.getElementById('comparisonGrid');
    
    // Calculate buying scenario
    const loanTerm = values.leaseTerm;
    const loanRate = values.apr / 100 / 12;
    const loanAmount = values.negotiatedPrice - values.tradeInValue - values.downPayment;
    const monthlyLoanPayment = loanAmount * (loanRate * Math.pow(1 + loanRate, loanTerm)) / (Math.pow(1 + loanRate, loanTerm) - 1);
    const totalLoanPayments = monthlyLoanPayment * loanTerm;
    const totalCostToBuy = totalLoanPayments + values.downPayment + values.upfrontTax;
    const netCostToBuy = totalCostToBuy - calc.residual;
    
    comparisonGrid.innerHTML = `
        <div class="comparison-column lease">
            <h3>Leasing</h3>
            <table>
                <tr>
                    <td>Monthly Payment</td>
                    <td><strong>${formatCurrency(calc.totalMonthlyPayment)}</strong></td>
                </tr>
                <tr>
                    <td>Down Payment</td>
                    <td>${formatCurrency(values.downPayment)}</td>
                </tr>
                <tr>
                    <td>Total Payments</td>
                    <td>${formatCurrency(calc.totalPayments)}</td>
                </tr>
                <tr>
                    <td>Total Cost</td>
                    <td><strong>${formatCurrency(calc.totalCost)}</strong></td>
                </tr>
                <tr>
                    <td>Vehicle Value at End</td>
                    <td>$0 (return vehicle)</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Net Cost</strong></td>
                    <td><strong>${formatCurrency(calc.totalCost)}</strong></td>
                </tr>
            </table>
        </div>
        
        <div class="comparison-column buy">
            <h3>Buying (Finance)</h3>
            <table>
                <tr>
                    <td>Monthly Payment</td>
                    <td><strong>${formatCurrency(monthlyLoanPayment)}</strong></td>
                </tr>
                <tr>
                    <td>Down Payment</td>
                    <td>${formatCurrency(values.downPayment)}</td>
                </tr>
                <tr>
                    <td>Total Payments</td>
                    <td>${formatCurrency(totalLoanPayments)}</td>
                </tr>
                <tr>
                    <td>Total Cost</td>
                    <td><strong>${formatCurrency(totalCostToBuy)}</strong></td>
                </tr>
                <tr>
                    <td>Vehicle Value at End</td>
                    <td>${formatCurrency(calc.residual)} (you own it)</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Net Cost</strong></td>
                    <td><strong>${formatCurrency(netCostToBuy)}</strong></td>
                </tr>
            </table>
        </div>
        
        <div class="comparison-recommendation">
            <strong>Financial Recommendation:</strong> 
            ${calc.totalCost < netCostToBuy 
                ? `Leasing is more cost-effective for this ${values.leaseTerm}-month period. You save <strong>${formatCurrency(netCostToBuy - calc.totalCost)}</strong> by leasing vs buying.`
                : `Buying is more cost-effective. You save <strong>${formatCurrency(calc.totalCost - netCostToBuy)}</strong> by buying vs leasing, and you own the vehicle at the end.`
            }
        </div>
    `;
    
    // Break-even Analysis
    const breakevenAnalysis = document.getElementById('breakevenAnalysis');
    const monthlyDifference = Math.abs(calc.totalMonthlyPayment - monthlyLoanPayment);
    const breakevenMonths = Math.abs((calc.totalCost - netCostToBuy) / monthlyDifference);
    
    breakevenAnalysis.innerHTML = `
        <div class="breakeven-card">
            <h4>Break-Even Point</h4>
            <p>If you keep the car for <strong>${Math.ceil(breakevenMonths)} months</strong>, the costs equalize.</p>
            <p>Monthly difference: <strong>${formatCurrency(monthlyDifference)}</strong></p>
            <p>${calc.totalCost < netCostToBuy 
                ? 'Leasing saves money in the short term, but buying builds equity.'
                : 'Buying is cheaper even in the short term and you build equity.'
            }</p>
        </div>
        
        <div class="breakeven-chart">
            <h4>Cost Over Time</h4>
            <table>
                <thead>
                    <tr>
                        <th>Timeframe</th>
                        <th>Lease Cost</th>
                        <th>Buy Cost (Net)</th>
                        <th>Difference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>12 months</td>
                        <td>${formatCurrency(calc.totalMonthlyPayment * 12 + advanced.upfrontCost)}</td>
                        <td>${formatCurrency(monthlyLoanPayment * 12 + values.downPayment + values.upfrontTax - (calc.residual * 0.9))}</td>
                        <td>${formatCurrency(Math.abs((calc.totalMonthlyPayment * 12 + advanced.upfrontCost) - (monthlyLoanPayment * 12 + values.downPayment + values.upfrontTax - (calc.residual * 0.9))))}</td>
                    </tr>
                    <tr>
                        <td>24 months</td>
                        <td>${formatCurrency(calc.totalMonthlyPayment * 24 + advanced.upfrontCost)}</td>
                        <td>${formatCurrency(monthlyLoanPayment * 24 + values.downPayment + values.upfrontTax - (calc.residual * 0.8))}</td>
                        <td>${formatCurrency(Math.abs((calc.totalMonthlyPayment * 24 + advanced.upfrontCost) - (monthlyLoanPayment * 24 + values.downPayment + values.upfrontTax - (calc.residual * 0.8))))}</td>
                    </tr>
                    <tr>
                        <td>${values.leaseTerm} months</td>
                        <td>${formatCurrency(calc.totalCost)}</td>
                        <td>${formatCurrency(netCostToBuy)}</td>
                        <td>${formatCurrency(Math.abs(calc.totalCost - netCostToBuy))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Alternative Scenarios
    const scenariosGrid = document.getElementById('scenariosGrid');
    
    // Scenario 1: Longer term
    const longerTerm = values.leaseTerm + 12;
    const longerMonthlyPayment = calc.totalMonthlyPayment * 0.85; // Estimate
    const longerTotalCost = longerMonthlyPayment * longerTerm + advanced.upfrontCost;
    
    // Scenario 2: Higher down payment
    const higherDown = values.downPayment + 3000;
    const lowerMonthlyPayment = calc.totalMonthlyPayment - (3000 / values.leaseTerm);
    const higherDownTotalCost = lowerMonthlyPayment * values.leaseTerm + higherDown + values.upfrontTax + values.acquisitionFee;
    
    // Scenario 3: Better negotiation
    const betterPrice = values.negotiatedPrice * 0.93; // 7% off MSRP
    const betterMonthlyPayment = calc.totalMonthlyPayment * 0.93;
    const betterTotalCost = betterMonthlyPayment * values.leaseTerm + advanced.upfrontCost;
    
    scenariosGrid.innerHTML = `
        <div class="scenario-card">
            <h4>Scenario: Extend to ${longerTerm} Months</h4>
            <div class="scenario-detail">
                <span>Monthly Payment:</span>
                <span>${formatCurrency(longerMonthlyPayment)}</span>
            </div>
            <div class="scenario-detail">
                <span>Total Cost:</span>
                <span>${formatCurrency(longerTotalCost)}</span>
            </div>
            <div class="scenario-impact ${longerTotalCost < calc.totalCost ? 'positive' : 'negative'}">
                ${longerTotalCost < calc.totalCost ? 'Saves' : 'Costs'} ${formatCurrency(Math.abs(longerTotalCost - calc.totalCost))}
            </div>
        </div>
        
        <div class="scenario-card">
            <h4>Scenario: $3,000 More Down</h4>
            <div class="scenario-detail">
                <span>Monthly Payment:</span>
                <span>${formatCurrency(lowerMonthlyPayment)}</span>
            </div>
            <div class="scenario-detail">
                <span>Total Cost:</span>
                <span>${formatCurrency(higherDownTotalCost)}</span>
            </div>
            <div class="scenario-impact ${higherDownTotalCost < calc.totalCost ? 'positive' : 'negative'}">
                ${higherDownTotalCost < calc.totalCost ? 'Saves' : 'Costs'} ${formatCurrency(Math.abs(higherDownTotalCost - calc.totalCost))}
            </div>
            <div class="scenario-warning">⚠ Risk: Lose $${higherDown.toLocaleString()} if car is totaled</div>
        </div>
        
        <div class="scenario-card">
            <h4>Scenario: Better Negotiation (7% off)</h4>
            <div class="scenario-detail">
                <span>Selling Price:</span>
                <span>${formatCurrency(betterPrice)}</span>
            </div>
            <div class="scenario-detail">
                <span>Monthly Payment:</span>
                <span>${formatCurrency(betterMonthlyPayment)}</span>
            </div>
            <div class="scenario-detail">
                <span>Total Cost:</span>
                <span>${formatCurrency(betterTotalCost)}</span>
            </div>
            <div class="scenario-impact positive">
                Saves ${formatCurrency(calc.totalCost - betterTotalCost)}
            </div>
        </div>
    `;
}

// Continue with pages 4, 5, 6 in next message...

// PAGE 4: Market Analysis & Benchmarking
function populatePage4(calc, values, advanced, benchmarks) {
    // Market Analysis
    const marketAnalysis = document.getElementById('marketAnalysis');
    
    const marketCards = [
        {
            metric: 'Payment vs Market',
            your: `${calc.paymentToMSRPRatio.toFixed(2)}%`,
            market: '1.00%',
            difference: benchmarks.paymentVsMarket.toFixed(2) + '%',
            status: benchmarks.paymentVsMarket <= 0 ? 'good' : 'bad'
        },
        {
            metric: 'Discount vs Market',
            your: `${calc.savingsPercentage.toFixed(1)}%`,
            market: '7.0%',
            difference: benchmarks.discountVsMarket.toFixed(1) + '%',
            status: benchmarks.discountVsMarket >= 0 ? 'good' : 'bad'
        },
        {
            metric: 'APR vs Market',
            your: `${values.apr.toFixed(2)}%`,
            market: '6.00%',
            difference: benchmarks.aprVsMarket.toFixed(2) + '%',
            status: benchmarks.aprVsMarket <= 0 ? 'good' : 'bad'
        },
        {
            metric: 'Residual vs Market',
            your: `${calc.residualPercent.toFixed(1)}%`,
            market: '60.0%',
            difference: benchmarks.residualVsMarket.toFixed(1) + '%',
            status: benchmarks.residualVsMarket >= 0 ? 'good' : 'bad'
        }
    ];
    
    marketAnalysis.innerHTML = `
        <div class="market-score-card">
            <h4>Market Position Score</h4>
            <div class="market-score-value">${benchmarks.marketPositionScore.toFixed(0)}/100</div>
            <div class="market-score-bar">
                <div class="market-score-fill" style="width: ${benchmarks.marketPositionScore}%"></div>
            </div>
            <p>${benchmarks.marketPositionScore >= 70 ? 'Excellent market position' : 
                 benchmarks.marketPositionScore >= 50 ? 'Average market position' : 
                 'Below market average'}</p>
        </div>
        
        ${marketCards.map(card => `
            <div class="market-card ${card.status}">
                <div class="market-metric">${card.metric}</div>
                <div class="market-comparison">
                    <div class="market-your">
                        <span class="market-label">Your Deal</span>
                        <span class="market-value">${card.your}</span>
                    </div>
                    <div class="market-arrow">${card.status === 'good' ? '✓' : '✗'}</div>
                    <div class="market-typical">
                        <span class="market-label">Market Avg</span>
                        <span class="market-value">${card.market}</span>
                    </div>
                </div>
                <div class="market-difference ${card.status}">
                    ${card.status === 'good' ? 'Better by' : 'Worse by'} ${Math.abs(parseFloat(card.difference))}%
                </div>
            </div>
        `).join('')}
    `;
    
    // Depreciation Analysis
    const depreciationAnalysis = document.getElementById('depreciationAnalysis');
    
    const yearlyDepreciation = [];
    let remainingValue = values.negotiatedPrice;
    const annualRate = advanced.annualDepreciationRate / 100;
    
    for (let year = 0; year <= Math.ceil(values.leaseTerm / 12); year++) {
        yearlyDepreciation.push({
            year: year,
            value: remainingValue,
            depreciation: year === 0 ? 0 : remainingValue * annualRate,
            percent: ((values.negotiatedPrice - remainingValue) / values.negotiatedPrice) * 100
        });
        remainingValue -= remainingValue * annualRate;
    }
    
    depreciationAnalysis.innerHTML = `
        <div class="depreciation-summary">
            <h4>Depreciation Summary</h4>
            <div class="depreciation-stats">
                <div class="depreciation-stat">
                    <span class="stat-label">Total Depreciation</span>
                    <span class="stat-value">${formatCurrency(values.negotiatedPrice - calc.residual)}</span>
                </div>
                <div class="depreciation-stat">
                    <span class="stat-label">Annual Rate</span>
                    <span class="stat-value">${advanced.annualDepreciationRate.toFixed(1)}%</span>
                </div>
                <div class="depreciation-stat">
                    <span class="stat-label">Monthly Cost</span>
                    <span class="stat-value">${formatCurrency(calc.monthlyDepreciation)}</span>
                </div>
            </div>
        </div>
        
        <div class="depreciation-table">
            <h4>Projected Value Over Time</h4>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Estimated Value</th>
                        <th>Depreciation</th>
                        <th>% Lost</th>
                    </tr>
                </thead>
                <tbody>
                    ${yearlyDepreciation.map(item => `
                        <tr>
                            <td>Year ${item.year}</td>
                            <td>${formatCurrency(item.value)}</td>
                            <td>${formatCurrency(item.depreciation)}</td>
                            <td>${item.percent.toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="depreciation-insight">
            <p><strong>Analysis:</strong> ${
                advanced.annualDepreciationRate < 15 ? 
                'Excellent depreciation rate. This vehicle holds its value well.' :
                advanced.annualDepreciationRate < 20 ?
                'Average depreciation rate. Typical for most vehicles.' :
                'High depreciation rate. Consider vehicles with better residual values.'
            }</p>
        </div>
    `;
    
}

// PAGE 5: Interest Rate & Risk Assessment
function populatePage5(calc, values, advanced, benchmarks, risks) {
    // Interest Rate Analysis (moved from page 4)
    const interestAnalysis = document.getElementById('interestAnalysis');
    
    const creditTiers = [
        { tier: 'Excellent (750+)', apr: 4.5, mf: 0.00188 },
        { tier: 'Good (700-749)', apr: 5.5, mf: 0.00229 },
        { tier: 'Fair (650-699)', apr: 6.5, mf: 0.00271 },
        { tier: 'Poor (600-649)', apr: 8.0, mf: 0.00333 },
        { tier: 'Very Poor (<600)', apr: 10.0, mf: 0.00417 }
    ];
    
    const yourTier = creditTiers.find(t => Math.abs(t.apr - values.apr) < 1) || creditTiers[2];
    
    interestAnalysis.innerHTML = `
        <div class="interest-summary">
            <h4>Your Interest Rate</h4>
            <div class="interest-current">
                <div class="interest-value">
                    <span class="interest-label">APR</span>
                    <span class="interest-number">${values.apr.toFixed(2)}%</span>
                </div>
                <div class="interest-value">
                    <span class="interest-label">Money Factor</span>
                    <span class="interest-number">${values.moneyFactor.toFixed(5)}</span>
                </div>
                <div class="interest-value">
                    <span class="interest-label">Total Interest</span>
                    <span class="interest-number">${formatCurrency(calc.totalInterest)}</span>
                </div>
            </div>
            <p class="interest-tier">Estimated Credit Tier: <strong>${yourTier.tier}</strong></p>
        </div>
        
        <div class="interest-comparison">
            <h4>Rate Comparison by Credit Tier</h4>
            <table>
                <thead>
                    <tr>
                        <th>Credit Tier</th>
                        <th>Typical APR</th>
                        <th>Money Factor</th>
                        <th>Monthly Interest</th>
                    </tr>
                </thead>
                <tbody>
                    ${creditTiers.map(tier => {
                        const monthlyInterest = (values.negotiatedPrice - values.tradeInValue + calc.residual) * tier.mf;
                        const isCurrent = Math.abs(tier.apr - values.apr) < 1;
                        
                        return `
                            <tr ${isCurrent ? 'class="current-tier"' : ''}>
                                <td>${tier.tier} ${isCurrent ? '← You' : ''}</td>
                                <td>${tier.apr.toFixed(2)}%</td>
                                <td>${tier.mf.toFixed(5)}</td>
                                <td>${formatCurrency(monthlyInterest)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="interest-insight">
            <p><strong>Potential Savings:</strong> ${
                values.apr > 6 ?
                `Improving your credit score to get a ${creditTiers[1].apr}% APR could save you approximately ${formatCurrency(calc.totalInterest - (creditTiers[1].mf * (values.negotiatedPrice - values.tradeInValue + calc.residual) * values.leaseTerm))} in interest.` :
                'You have an excellent interest rate. Well done!'
            }</p>
        </div>
    `;
    
    // Risk Analysis
    const riskAnalysis = document.getElementById('riskAnalysis');
    
    if (risks.length === 0) {
        riskAnalysis.innerHTML = `
            <div class="risk-none">
                <h4>✓ No Significant Risks Identified</h4>
                <p>Your lease structure appears sound with minimal risk factors.</p>
            </div>
        `;
    } else {
        riskAnalysis.innerHTML = risks.map(risk => `
            <div class="risk-card risk-${risk.level}">
                <div class="risk-header">
                    <span class="risk-category">${risk.category}</span>
                    <span class="risk-level">${risk.level.toUpperCase()} RISK</span>
                </div>
                <h4>${risk.title}</h4>
                <p class="risk-description">${risk.description}</p>
                <div class="risk-impact">
                    <strong>Impact:</strong> ${risk.impact}
                </div>
                <div class="risk-recommendation">
                    <strong>Recommendation:</strong> ${risk.recommendation}
                </div>
            </div>
        `).join('');
    }
}

// PAGE 6: Optimization & Negotiation Strategy
function populatePage6(calc, values, optimizations, risks) {
    // Optimization Recommendations
    const optimizationRecommendations = document.getElementById('optimizationRecommendations');
    
    if (optimizations.length === 0) {
        optimizationRecommendations.innerHTML = `
            <div class="optimization-none">
                <h4>✓ Deal is Well-Optimized</h4>
                <p>Your lease terms are competitive. No major optimization opportunities identified.</p>
            </div>
        `;
    } else {
        optimizationRecommendations.innerHTML = optimizations.map(opt => `
            <div class="optimization-card">
                <div class="optimization-header">
                    <h4>${opt.title}</h4>
                    <span class="optimization-category">${opt.category}</span>
                </div>
                <div class="optimization-comparison">
                    <strong>${opt.current}</strong> → <strong>${opt.target}</strong>
                </div>
                <div class="optimization-savings">
                    Savings: ${opt.savings}
                </div>
                <div class="optimization-actions">
                    <ul>
                        ${opt.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }
    
    // Negotiation Strategy
    const negotiationStrategy = document.getElementById('negotiationStrategy');
    
    const negotiationTips = [];
    
    if (calc.savingsPercentage < 7) {
        negotiationTips.push({
            priority: 'HIGH',
            strategy: 'Price Negotiation',
            tactics: [
                'Research dealer invoice price (typically 5-10% below MSRP)',
                'Get quotes from at least 3 dealers',
                'Negotiate at month-end or quarter-end for better deals',
                'Focus on selling price, not monthly payment',
                'Be prepared to walk away if terms aren\'t favorable'
            ]
        });
    }
    
    if (values.apr > 6) {
        negotiationTips.push({
            priority: 'MEDIUM',
            strategy: 'Interest Rate Reduction',
            tactics: [
                'Check your credit score and correct any errors',
                'Get pre-approved from your bank or credit union',
                'Ask dealer to match or beat your pre-approval rate',
                'Negotiate money factor separately from price',
                'Consider waiting to improve credit score if possible'
            ]
        });
    }
    
    if (values.downPayment > 0) {
        negotiationTips.push({
            priority: 'MEDIUM',
            strategy: 'Down Payment Elimination',
            tactics: [
                'Request zero-down payment structure',
                'Roll acquisition fee into monthly payments',
                'Use trade-in value instead of cash down',
                'Keep cash for emergency fund or investments',
                'Negotiate lower monthly payment through price reduction instead'
            ]
        });
    }
    
    negotiationTips.push({
        priority: 'LOW',
        strategy: 'Fee Reduction',
        tactics: [
            'Negotiate or waive acquisition fee',
            'Ask about manufacturer incentives and rebates',
            'Request dealer to cover first month\'s payment',
            'Negotiate free maintenance or service package',
            'Ask for waived disposition fee at lease end'
        ]
    });
    
    negotiationStrategy.innerHTML = `
        ${negotiationTips.map(tip => `
            <div class="negotiation-card priority-${tip.priority.toLowerCase()}">
                <div class="negotiation-header">
                    <h4>${tip.strategy}</h4>
                    <span class="negotiation-priority">${tip.priority}</span>
                </div>
                <ul class="negotiation-tactics">
                    ${tip.tactics.slice(0, 4).map(tactic => `<li>${tactic}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
        
        <div class="negotiation-summary">
            <h4>Key Principles</h4>
            <ul>
                <li>Negotiate selling price first, not monthly payment</li>
                <li>Get everything in writing - verbal promises don't count</li>
                <li><strong>Read the entire contract</strong> - Check for hidden fees or terms</li>
                <li><strong>Don't rush</strong> - Take time to review and compare offers</li>
                <li><strong>Be willing to walk away</strong> - Your best negotiating power</li>
            </ul>
        </div>
    `;
}

// PAGE 7: Vehicle Details & Terms
function populatePage7(calc, values) {
    // Vehicle Details
    const vehicleDetails = document.getElementById('vehicleDetails');
    const details = [
        { label: 'MSRP', value: formatCurrency(values.msrp) },
        { label: 'Negotiated Price', value: formatCurrency(values.negotiatedPrice) },
        { label: 'Savings from MSRP', value: `${formatCurrency(calc.savingsFromMSRP)} (${calc.savingsPercentage.toFixed(1)}%)` },
        { label: 'Trade-in Value', value: formatCurrency(values.tradeInValue) },
        { label: 'Residual Value', value: `${formatCurrency(calc.residual)} (${calc.residualPercent.toFixed(1)}%)` },
        { label: 'Net Capitalized Cost', value: formatCurrency(values.negotiatedPrice - values.tradeInValue - values.downPayment + values.acquisitionFee) }
    ];
    
    vehicleDetails.innerHTML = details.map(item => `
        <div class="detail-item">
            <span class="detail-label">${item.label}</span>
            <span class="detail-value">${item.value}</span>
        </div>
    `).join('');
    
    // Lease Terms
    const leaseTerms = document.getElementById('leaseTerms');
    const terms = [
        { label: 'Lease Term', value: `${values.leaseTerm} months` },
        { label: 'Down Payment', value: formatCurrency(values.downPayment) },
        { label: 'Monthly Payment (before tax)', value: formatCurrency(values.monthlyPayment) },
        { label: 'Sales Tax Rate', value: `${values.salesTax.toFixed(2)}%` },
        { label: 'Monthly Sales Tax', value: formatCurrency(calc.monthlyTax) },
        { label: 'Total Monthly Payment', value: formatCurrency(calc.totalMonthlyPayment) },
        { label: 'Upfront Tax', value: formatCurrency(values.upfrontTax) },
        { label: 'Acquisition Fee', value: formatCurrency(values.acquisitionFee) }
    ];
    
    leaseTerms.innerHTML = terms.map(item => `
        <div class="detail-item">
            <span class="detail-label">${item.label}</span>
            <span class="detail-value">${item.value}</span>
        </div>
    `).join('');
    
    // Financial Details
    const financialDetails = document.getElementById('financialDetails');
    const financial = [
        { label: 'Money Factor', value: values.moneyFactor.toFixed(5) },
        { label: 'APR Equivalent', value: `${values.apr.toFixed(2)}%` },
        { label: 'Monthly Depreciation', value: formatCurrency(calc.monthlyDepreciation) },
        { label: 'Monthly Interest', value: formatCurrency(calc.monthlyInterest) },
        { label: 'Total Depreciation', value: formatCurrency(calc.totalDepreciation) },
        { label: 'Total Interest', value: formatCurrency(calc.totalInterest) },
        { label: 'Total Payments', value: formatCurrency(calc.totalPayments) },
        { label: 'Total Lease Cost', value: formatCurrency(calc.totalCost) }
    ];
    
    financialDetails.innerHTML = financial.map(item => `
        <div class="detail-item">
            <span class="detail-label">${item.label}</span>
            <span class="detail-value">${item.value}</span>
        </div>
    `).join('');
}

// Export to PDF function
function exportToPDF() {
    window.print();
}
