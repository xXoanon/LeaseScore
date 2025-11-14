// LeaseScore Calculator with Real-Time Validation
let lastCalculation = null;
let validationTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupStickyHeader();
});

// Sticky header shrink on scroll
function setupStickyHeader() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

function initializeCalculator() {
    setupSliders();
    setupRealTimeValidation();
    setupAdvancedToggle();
    setupInputModeToggle();
    setupFormSubmit();
    setupClearButton();
    updateMoneyFactorConversion();
}

// Slider synchronization with real-time updates
function setupSliders() {
    const sliderPairs = [
        { input: 'msrp', slider: 'msrpSlider' },
        { input: 'negotiatedPrice', slider: 'negotiatedPriceSlider' },
        { input: 'monthlyPayment', slider: 'monthlyPaymentSlider' },
        { input: 'downPayment', slider: 'downPaymentSlider' },
        { input: 'salesTax', slider: 'salesTaxSlider' },
        { input: 'residualValue', slider: 'residualValueSlider' },
        { input: 'tradeInValue', slider: 'tradeInValueSlider' },
        { input: 'upfrontTax', slider: 'upfrontTaxSlider' },
        { input: 'acquisitionFee', slider: 'acquisitionFeeSlider' }
    ];
    
    sliderPairs.forEach(pair => {
        const input = document.getElementById(pair.input);
        const slider = document.getElementById(pair.slider);
        
        if (!input || !slider) return;
        
        input.addEventListener('input', () => {
            const value = parseFloat(input.value) || 0;
            slider.value = Math.min(Math.max(value, parseFloat(slider.min)), parseFloat(slider.max));
            validateAllFields();
        });
        
        slider.addEventListener('input', () => {
            input.value = slider.value;
            validateAllFields();
        });
    });
}

// Real-time validation setup
function setupRealTimeValidation() {
    const fields = ['msrp', 'negotiatedPrice', 'monthlyPayment', 'downPayment', 'salesTax', 
                    'moneyFactor', 'interestRate', 'residualValue', 'leaseTerm'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.addEventListener('input', () => {
            validateAllFields();
        });
        
        field.addEventListener('change', () => {
            validateAllFields();
        });
        
        field.addEventListener('blur', () => {
            validateAllFields();
        });
    });
}

// Validate all fields at once (so they update together)
function validateAllFields() {
    validateFieldRealTime('msrp');
    validateFieldRealTime('negotiatedPrice');
    validateFieldRealTime('monthlyPayment');
    validateFieldRealTime('downPayment');
    validateFieldRealTime('salesTax');
    validateFieldRealTime('moneyFactor');
    validateFieldRealTime('interestRate');
    validateFieldRealTime('residualValue');
}

// Real-time field validation with visual feedback
function validateFieldRealTime(fieldId) {
    const field = document.getElementById(fieldId);
    const statusEl = document.getElementById(fieldId + 'Status');
    const hintEl = document.getElementById(fieldId + 'Hint');
    
    if (!field) return;
    
    const value = parseFloat(field.value) || 0;
    const msrp = parseFloat(document.getElementById('msrp').value) || 0;
    const negotiatedPrice = parseFloat(document.getElementById('negotiatedPrice').value) || 0;
    
    let status = '';
    let hint = '';
    let statusClass = '';
    
    switch(fieldId) {
        case 'msrp':
            if (value > 0) {
                status = '✓';
                statusClass = 'valid';
            }
            break;
            
        case 'negotiatedPrice':
            if (value > 0 && msrp > 0) {
                const discount = ((msrp - value) / msrp) * 100;
                if (value > msrp * 1.5) {
                    status = '✗';
                    hint = `DANGER! Paying ${Math.abs(discount).toFixed(1)}% OVER MSRP - This is a terrible deal!`;
                    statusClass = 'error';
                } else if (value > msrp * 1.3) {
                    status = '✗';
                    hint = `WARNING! Paying ${Math.abs(discount).toFixed(1)}% over MSRP - Very bad deal!`;
                    statusClass = 'error';
                } else if (value > msrp * 1.1) {
                    status = '⚠';
                    hint = `Paying ${Math.abs(discount).toFixed(1)}% over MSRP - Bad deal`;
                    statusClass = 'warning';
                } else if (discount >= 10) {
                    status = '✓';
                    hint = `Excellent! ${discount.toFixed(1)}% off MSRP ($${(msrp - value).toLocaleString()})`;
                    statusClass = 'valid';
                } else if (discount >= 5) {
                    status = '✓';
                    hint = `Good discount: ${discount.toFixed(1)}% off MSRP ($${(msrp - value).toLocaleString()})`;
                    statusClass = 'valid';
                } else if (discount >= 0) {
                    status = 'ℹ';
                    hint = `${discount.toFixed(1)}% off MSRP ($${(msrp - value).toLocaleString()})`;
                    statusClass = 'info';
                } else {
                    status = '⚠';
                    hint = `Paying ${Math.abs(discount).toFixed(1)}% over MSRP`;
                    statusClass = 'warning';
                }
            }
            break;
            
        case 'monthlyPayment':
            if (value > 0 && msrp > 0) {
                const salesTax = parseFloat(document.getElementById('salesTax').value) || 0;
                const totalPayment = value * (1 + salesTax / 100);
                const ratio = (totalPayment / msrp) * 100;
                
                if (value > msrp * 0.1) {
                    status = '✗';
                    hint = `DANGER! $${value.toLocaleString()}/month seems impossibly high - Did you mean to enter this as the car price?`;
                    statusClass = 'error';
                } else if (value > msrp * 0.05) {
                    status = '✗';
                    hint = `WARNING! $${value.toLocaleString()}/month is extremely high - Please verify this is correct`;
                    statusClass = 'error';
                } else if (ratio <= 0.8) {
                    status = '✓';
                    hint = `Excellent! ${ratio.toFixed(2)}% of MSRP (well below 1% rule)`;
                    statusClass = 'valid';
                } else if (ratio <= 1.0) {
                    status = '✓';
                    hint = `Great! ${ratio.toFixed(2)}% of MSRP (meets 1% rule)`;
                    statusClass = 'valid';
                } else if (ratio <= 1.2) {
                    status = 'ℹ';
                    hint = `${ratio.toFixed(2)}% of MSRP (slightly above 1% rule)`;
                    statusClass = 'info';
                } else if (ratio <= 1.5) {
                    status = '⚠';
                    hint = `${ratio.toFixed(2)}% of MSRP (above 1% rule)`;
                    statusClass = 'warning';
                } else {
                    status = '✗';
                    hint = `${ratio.toFixed(2)}% of MSRP - This is a terrible deal!`;
                    statusClass = 'error';
                }
            }
            break;
            
        case 'downPayment':
            if (value === 0) {
                status = '✓';
                hint = 'Perfect! Zero down is ideal for leases';
                statusClass = 'valid';
            } else if (value > 0 && msrp > 0) {
                if (value <= msrp * 0.05) {
                    status = 'ℹ';
                    hint = 'Low down payment is acceptable';
                    statusClass = 'info';
                } else {
                    status = '⚠';
                    hint = 'High down payment is risky on a lease';
                    statusClass = 'warning';
                }
            }
            break;
            
        case 'moneyFactor':
            if (value > 0) {
                const apr = value * 2400;
                if (document.getElementById('aprEquivalent')) {
                    document.getElementById('aprEquivalent').textContent = apr.toFixed(2) + '%';
                }
                if (apr < 4) {
                    status = '✓';
                    statusClass = 'valid';
                } else if (apr > 8) {
                    status = '⚠';
                    statusClass = 'warning';
                } else {
                    status = 'ℹ';
                    statusClass = 'info';
                }
            }
            break;
            
        case 'interestRate':
            if (value > 0) {
                const mf = value / 2400;
                if (document.getElementById('mfEquivalent')) {
                    document.getElementById('mfEquivalent').textContent = mf.toFixed(5);
                }
                if (value < 4) {
                    status = '✓';
                    statusClass = 'valid';
                } else if (value > 8) {
                    status = '⚠';
                    statusClass = 'warning';
                } else {
                    status = 'ℹ';
                    statusClass = 'info';
                }
            }
            break;
            
        case 'residualValue':
            if (value > 0 && negotiatedPrice > 0) {
                const percent = (value / negotiatedPrice) * 100;
                if (percent > 150) {
                    status = '✗';
                    hint = `DANGER! ${percent.toFixed(0)}% of negotiated price - This is impossible!`;
                    statusClass = 'error';
                } else if (percent > 100) {
                    status = '✗';
                    hint = `WARNING! ${percent.toFixed(0)}% of negotiated price - Residual can't be higher than price!`;
                    statusClass = 'error';
                } else if (percent > 70) {
                    status = '✓';
                    hint = `${percent.toFixed(0)}% of negotiated price - excellent`;
                    statusClass = 'valid';
                } else if (percent >= 50) {
                    status = 'ℹ';
                    hint = `${percent.toFixed(0)}% of negotiated price - typical`;
                    statusClass = 'info';
                } else {
                    status = '⚠';
                    hint = `${percent.toFixed(0)}% of negotiated price - low`;
                    statusClass = 'warning';
                }
            } else if (!value || value === 0) {
                hint = 'Will auto-calculate as 60% of negotiated price';
                statusClass = 'info';
            }
            break;
    }
    
    if (statusEl) {
        statusEl.textContent = status;
        statusEl.className = 'field-status ' + statusClass;
    }
    
    if (hintEl) {
        hintEl.textContent = hint;
        hintEl.className = 'field-hint ' + statusClass;
    }
}

// Live score removed - only shown in report

// Money factor / APR conversion
function updateMoneyFactorConversion() {
    const mfInput = document.getElementById('moneyFactor');
    const irInput = document.getElementById('interestRate');
    
    if (mfInput) {
        mfInput.addEventListener('input', () => {
            const mf = parseFloat(mfInput.value) || 0;
            const apr = mf * 2400;
            if (document.getElementById('aprEquivalent')) {
                document.getElementById('aprEquivalent').textContent = apr.toFixed(2) + '%';
            }
            validateAllFields();
        });
    }
    
    if (irInput) {
        irInput.addEventListener('input', () => {
            const apr = parseFloat(irInput.value) || 0;
            const mf = apr / 2400;
            if (document.getElementById('mfEquivalent')) {
                document.getElementById('mfEquivalent').textContent = mf.toFixed(5);
            }
            validateAllFields();
        });
    }
}

// Advanced toggle - removed, now always visible
function setupAdvancedToggle() {
    // Advanced options are now always visible
}

// Input mode toggle
function setupInputModeToggle() {
    const inputMode = document.getElementById('inputMode');
    const mfGroup = document.getElementById('moneyFactorGroup');
    const irGroup = document.getElementById('interestRateGroup');
    
    if (inputMode && mfGroup && irGroup) {
        // Initialize display state on page load
        if (inputMode.value === 'moneyFactor') {
            mfGroup.style.display = 'block';
            irGroup.style.display = 'none';
        } else {
            mfGroup.style.display = 'none';
            irGroup.style.display = 'block';
        }
        
        // Handle changes
        inputMode.addEventListener('change', () => {
            if (inputMode.value === 'moneyFactor') {
                mfGroup.style.display = 'block';
                irGroup.style.display = 'none';
            } else {
                mfGroup.style.display = 'none';
                irGroup.style.display = 'block';
            }
        });
    }
}

// Form submission - Single button to generate report
function setupFormSubmit() {
    document.getElementById('leaseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        generateReport();
    });
}

// Clear button
function setupClearButton() {
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('leaseForm').reset();
        
        // Clear all status indicators
        document.querySelectorAll('.field-status').forEach(el => el.textContent = '');
        document.querySelectorAll('.field-hint').forEach(el => el.textContent = '');
        
        lastCalculation = null;
    });
}

// Generate detailed report
function generateReport() {
    const msrp = parseFloat(document.getElementById('msrp').value) || 0;
    const negotiatedPrice = parseFloat(document.getElementById('negotiatedPrice').value) || 0;
    const monthlyPayment = parseFloat(document.getElementById('monthlyPayment').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const leaseTerm = parseInt(document.getElementById('leaseTerm').value) || 36;
    const salesTax = parseFloat(document.getElementById('salesTax').value) || 0;
    
    const residualInput = document.getElementById('residualValue').value;
    let residualValue;
    if (residualInput) {
        residualValue = parseFloat(residualInput);
    } else {
        residualValue = negotiatedPrice * 0.60;
    }
    
    const tradeInValue = parseFloat(document.getElementById('tradeInValue').value) || 0;
    const upfrontTax = parseFloat(document.getElementById('upfrontTax').value) || 0;
    const acquisitionFee = parseFloat(document.getElementById('acquisitionFee').value) || 595;
    
    const inputMode = document.getElementById('inputMode').value;
    let moneyFactor, apr;
    
    if (inputMode === 'moneyFactor') {
        moneyFactor = parseFloat(document.getElementById('moneyFactor').value) || 0.00250;
        apr = moneyFactor * 2400;
    } else {
        apr = parseFloat(document.getElementById('interestRate').value) || 6.0;
        moneyFactor = apr / 2400;
    }

    // Basic validation only
    if (msrp <= 0 || negotiatedPrice <= 0 || monthlyPayment <= 0) {
        alert('Please enter valid values for MSRP, Negotiated Price, and Monthly Payment');
        return;
    }
    
    // Calculate lease details
    const netCapCost = negotiatedPrice - tradeInValue - downPayment + acquisitionFee;
    const monthlyDepreciation = (netCapCost - residualValue) / leaseTerm;
    const monthlyInterest = (netCapCost + residualValue) * moneyFactor;
    const basePayment = monthlyDepreciation + monthlyInterest;
    const monthlyTax = monthlyPayment * (salesTax / 100);
    const totalMonthlyPayment = monthlyPayment + monthlyTax;
    
    const totalPayments = totalMonthlyPayment * leaseTerm;
    const totalDepreciation = monthlyDepreciation * leaseTerm;
    const totalInterest = monthlyInterest * leaseTerm;
    const totalCost = downPayment + upfrontTax + totalPayments;
    const costToOwnAfterLease = totalCost + residualValue;
    
    const savingsFromMSRP = msrp - negotiatedPrice;
    const savingsPercentage = (savingsFromMSRP / msrp) * 100;
    const paymentToMSRPRatio = (totalMonthlyPayment / msrp) * 100;
    const residualPercent = (residualValue / negotiatedPrice) * 100;
    
    // Scoring system
    let score = 0;
    let insights = [];
    
    // 1% Rule scoring
    let onePercentScore = 0;
    let onePercentStatus = '';
    if (paymentToMSRPRatio <= 0.8) {
        onePercentScore = 1.5;
        onePercentStatus = 'Excellent';
        insights.push({ type: 'excellent', message: 'Outstanding! Payment is well below 1% of MSRP - this is an exceptional deal.' });
    } else if (paymentToMSRPRatio <= 1.0) {
        onePercentScore = 1.25;
        onePercentStatus = 'Great';
        insights.push({ type: 'good', message: 'Great deal! Payment meets the 1% rule benchmark.' });
    } else if (paymentToMSRPRatio <= 1.2) {
        onePercentScore = 0.75;
        onePercentStatus = 'Good';
        insights.push({ type: 'info', message: 'Decent deal, but payment is slightly above the 1% rule.' });
    } else if (paymentToMSRPRatio <= 1.5) {
        onePercentScore = 0.25;
        onePercentStatus = 'Fair';
        insights.push({ type: 'warning', message: 'Payment is significantly above 1% of MSRP. Consider negotiating further.' });
    } else {
        onePercentScore = 0;
        onePercentStatus = 'Poor';
        insights.push({ type: 'critical', message: 'Payment is too high relative to MSRP. This is not a good deal.' });
    }
    score += onePercentScore;
    
    // Down payment scoring
    let downPaymentScore = 0;
    let downPaymentStatus = '';
    if (downPayment === 0) {
        downPaymentScore = 1.0;
        downPaymentStatus = 'Excellent';
        insights.push({ type: 'excellent', message: 'Perfect! Zero down payment protects you from loss if the car is totaled.' });
    } else if (downPayment <= msrp * 0.05) {
        downPaymentScore = 0.5;
        downPaymentStatus = 'Good';
        insights.push({ type: 'info', message: 'Low down payment is acceptable, but zero down is ideal for leases.' });
    } else {
        downPaymentScore = 0;
        downPaymentStatus = 'Poor';
        insights.push({ type: 'warning', message: `Down payment of $${downPayment.toLocaleString()} is risky. If the car is totaled, you lose this money.` });
    }
    score += downPaymentScore;

    // Negotiation scoring
    let negotiationScore = 0;
    let negotiationStatus = '';
    if (savingsPercentage >= 10) {
        negotiationScore = 1.5;
        negotiationStatus = 'Excellent';
        insights.push({ type: 'excellent', message: `Excellent negotiation! You saved ${savingsPercentage.toFixed(1)}% off MSRP ($${savingsFromMSRP.toLocaleString()}).` });
    } else if (savingsPercentage >= 7) {
        negotiationScore = 1.0;
        negotiationStatus = 'Great';
        insights.push({ type: 'good', message: `Good negotiation with ${savingsPercentage.toFixed(1)}% discount from MSRP ($${savingsFromMSRP.toLocaleString()}).` });
    } else if (savingsPercentage >= 5) {
        negotiationScore = 0.75;
        negotiationStatus = 'Good';
        insights.push({ type: 'info', message: `Decent discount of ${savingsPercentage.toFixed(1)}% from MSRP ($${savingsFromMSRP.toLocaleString()}).` });
    } else if (savingsPercentage >= 3) {
        negotiationScore = 0.5;
        negotiationStatus = 'Fair';
        insights.push({ type: 'warning', message: `Only ${savingsPercentage.toFixed(1)}% off MSRP. Try negotiating further.` });
    } else if (savingsPercentage >= 0) {
        negotiationScore = 0;
        negotiationStatus = 'Poor';
        insights.push({ type: 'critical', message: `Minimal discount from MSRP (${savingsPercentage.toFixed(1)}%). You should negotiate the price more aggressively.` });
    } else {
        negotiationScore = 0;
        negotiationStatus = 'Poor';
        insights.push({ type: 'critical', message: `You're paying ${Math.abs(savingsPercentage).toFixed(1)}% OVER MSRP. This is a bad deal - negotiate down to MSRP or below.` });
    }
    score += negotiationScore;
    
    // Additional insights
    if (apr > 8) {
        insights.push({ type: 'warning', message: `Interest rate of ${apr.toFixed(2)}% is high. Shop around for better rates.` });
    } else if (apr < 4) {
        insights.push({ type: 'good', message: `Excellent interest rate of ${apr.toFixed(2)}%!` });
    }
    
    if (residualPercent > 100) {
        insights.push({ type: 'critical', message: `Residual value (${residualPercent.toFixed(1)}%) is higher than negotiated price. This is incorrect - please verify your values.` });
    } else if (residualPercent > 70) {
        insights.push({ type: 'good', message: `High residual value (${residualPercent.toFixed(1)}%) helps keep payments low.` });
    } else if (residualPercent >= 50) {
        insights.push({ type: 'info', message: `Residual value of ${residualPercent.toFixed(1)}% is typical for most leases.` });
    } else if (residualPercent >= 40) {
        insights.push({ type: 'warning', message: `Residual value (${residualPercent.toFixed(1)}%) is on the lower side, resulting in higher depreciation costs.` });
    } else {
        insights.push({ type: 'warning', message: `Very low residual value (${residualPercent.toFixed(1)}%) means you're paying for most of the car's depreciation.` });
    }
    
    // Overall deal rating
    let dealRating = '';
    let dealClass = '';
    if (score >= 3.5) {
        dealRating = 'Exceptional Deal';
        dealClass = 'good';
    } else if (score >= 3.0) {
        dealRating = 'Great Deal';
        dealClass = 'good';
    } else if (score >= 2.5) {
        dealRating = 'Good Deal';
        dealClass = 'good';
    } else if (score >= 2.0) {
        dealRating = 'Fair Deal';
        dealClass = 'neutral';
    } else if (score >= 1.5) {
        dealRating = 'Below Average';
        dealClass = 'bad';
    } else {
        dealRating = 'Poor Deal';
        dealClass = 'bad';
    }
    
    // Store calculation for report
    lastCalculation = {
        calc: {
            monthlyDepreciation,
            monthlyInterest,
            monthlyTax,
            totalMonthlyPayment,
            totalPayments,
            totalDepreciation,
            totalInterest,
            totalCost,
            residual: residualValue,
            residualPercent,
            costToOwnAfterLease,
            savingsFromMSRP,
            savingsPercentage,
            paymentToMSRPRatio,
            score,
            onePercentScore,
            onePercentStatus,
            downPaymentScore,
            downPaymentStatus,
            negotiationScore,
            negotiationStatus,
            dealRating,
            dealClass,
            insights
        },
        values: {
            msrp,
            negotiatedPrice,
            monthlyPayment,
            downPayment,
            leaseTerm,
            salesTax,
            moneyFactor,
            apr,
            residualValue,
            tradeInValue,
            upfrontTax,
            acquisitionFee
        }
    };
    
    // Store data in localStorage and open report
    localStorage.setItem('leaseReportData', JSON.stringify(lastCalculation));
    window.open('report.html', '_blank');
}
