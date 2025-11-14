# Car Lease Calculator - Setup Guide

## Overview
This document provides setup instructions and configuration details for the Car Lease Calculator, including ad placements, donation links, SEO optimization, and feature documentation.

## Project Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── calculator.js       # Calculator logic and functionality
├── README.md          # Quick start guide
├── SETUP.md           # This file - detailed setup
├── FEATURES.md        # Complete feature list
├── MIGRATION.md       # Migration guide
└── PROJECT-SUMMARY.md # Overall project summary
```

The calculator is now properly separated into HTML, CSS, and JavaScript files for better maintainability and scalability.

---

## Features

### Calculator Functionality
- **Real-time calculations** - Results update instantly as you adjust inputs
- **1% Rule evaluation** - Checks if monthly payment ≤ 1% of MSRP
- **Down Payment Rule** - Validates that no down payment is required (best practice for leases)
- **Negotiation Rule** - Checks if you got at least 5% off MSRP
- **Money Factor to APR conversion** - Automatically converts money factor × 2400
- **Deal scoring system** - Rates deals as Great (3/3), Good (2/3), Fair (1/3), or Bad (0/3)
- **Simple/Advanced modes** - Toggle between basic and detailed inputs
- **Multiple tabs** - Lease Calculator, Lease vs Buy Comparison, Payment Breakdown
- **Flexible input** - Choose between Money Factor or Interest Rate (APR)
- **Detailed breakdowns** - Monthly and total cost analysis

### Input Fields

#### Simple Mode (Default)
1. **MSRP** - The sticker price of the car
2. **Negotiated Price** - What you're actually paying
3. **Monthly Payment** - Before tax amount
4. **Down Payment** - Cap cost reduction
5. **Lease Term** - 24, 36, or 48 months
6. **Sales Tax** - Percentage (0-15%)
7. **Money Factor or Interest Rate** - Toggle between input types

#### Advanced Mode (Additional Fields)
8. **Residual Value** - Estimated value at lease end
9. **Trade-in Value** - Value of your current vehicle
10. **Upfront Tax** - Tax paid at signing
11. **Acquisition Fee** - Bank processing fee

### Three Calculation Tabs

#### 1. Lease Calculator
- Evaluates if your lease is a good deal
- Shows monthly breakdown (depreciation, interest, tax)
- Displays total costs and cost to own after lease
- Pass/fail indicators for the 3 rules

#### 2. Lease vs Buy Comparison
- Side-by-side comparison table
- Shows monthly payments for both options
- Calculates net cost after residual value
- Provides recommendation based on your scenario

#### 3. Payment Breakdown
- Detailed monthly cost breakdown
- Total lease cost summary
- Educational explanations of each component
- Helps understand where your money goes

---

## Ad Placements

### 1. Header Ad (728x90)
**Location:** Directly below the main title "Is Your Car Lease a Good Deal?"
**Format:** Horizontal banner
**Standard Size:** 728x90 (Leaderboard)
**Mobile Size:** Adjusts to 320x50

```html
<!-- Header Ad Slot -->
<div class="ad-slot ad-header">
    Advertisement - 728x90
</div>
```

**To activate:**
Replace the placeholder div with your ad network code (Google AdSense, etc.):
```html
<div class="ad-slot ad-header">
    <!-- Insert your ad code here -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

### 2. Sidebar Ad (300x250)
**Location:** In the Results column, below the calculated score
**Format:** Vertical rectangle
**Standard Size:** 300x250 (Medium Rectangle)
**Mobile Size:** Adjusts to 300x200
**Value:** HIGH - Users view this after getting results

```html
<!-- Sidebar Ad Slot -->
<div class="ad-slot ad-sidebar">
    Advertisement - 300x250
</div>
```

### 3. Footer Ad (728x90)
**Location:** Bottom of the page, below both columns
**Format:** Horizontal banner
**Standard Size:** 728x90 (Leaderboard)
**Mobile Size:** Adjusts to 320x50

```html
<!-- Footer Ad Slot -->
<div class="ad-slot ad-footer">
    Advertisement - 728x90
</div>
```

---

## Buy Me a Coffee Setup

### Current Implementation
The "Buy Me a Coffee" call-to-action appears in the Results section, directly below the deal score.

**Message:** "Find this calculator helpful?"
**Button Text:** "Buy Me a Coffee ☕"

### To Activate
Find this line in `calculator.js` (in the `displayResults` function):
```javascript
<a href="#" class="coffee-button" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>
```

Replace `href="#"` with your donation link:

**Buy Me a Coffee:**
```javascript
<a href="https://www.buymeacoffee.com/yourusername" class="coffee-button" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>
```

**Ko-fi:**
```javascript
<a href="https://ko-fi.com/yourusername" class="coffee-button" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>
```

**PayPal:**
```javascript
<a href="https://paypal.me/yourusername" class="coffee-button" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>
```

**Custom Link:**
```javascript
<a href="https://yourdonationlink.com" class="coffee-button" target="_blank" rel="noopener">Buy Me a Coffee ☕</a>
```

---

## SEO Configuration

### Meta Tags Setup

#### 1. Update Domain URLs
Replace `https://yourdomain.com/` with your actual domain in these locations:

```html
<!-- Open Graph URL -->
<meta property="og:url" content="https://yourdomain.com/">

<!-- Twitter URL -->
<meta property="twitter:url" content="https://yourdomain.com/">

<!-- Canonical URL -->
<link rel="canonical" href="https://yourdomain.com/">
```

#### 2. Add Social Media Images
Create and upload these images:

**Open Graph Image (Facebook/LinkedIn):**
- Size: 1200x630 pixels
- Format: JPG or PNG
- Update: `<meta property="og:image" content="https://yourdomain.com/og-image.jpg">`

**Twitter Card Image:**
- Size: 1200x600 pixels
- Format: JPG or PNG
- Update: `<meta property="twitter:image" content="https://yourdomain.com/twitter-image.jpg">`

**Image Tips:**
- Include calculator screenshot or branded graphic
- Add text overlay: "Car Lease Calculator - Is It a Good Deal?"
- Use high contrast colors
- Test with Facebook Debugger and Twitter Card Validator

#### 3. Current SEO Tags

**Title:** Car Lease Calculator - Is It a Good Deal?

**Description:** Free lease payment calculator to evaluate car lease deals. Calculate monthly payments, money factor to APR, and determine if your auto lease is a good deal using the 1% rule.

**Keywords:** lease payment calculator, car lease deals, auto lease, money factor, lease calculator, car leasing, monthly payment calculator, lease vs buy, 1% rule, lease negotiation

### SEO Best Practices

1. **Submit to Search Engines**
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters

2. **Create a sitemap.xml**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://yourdomain.com/</loc>
       <lastmod>2025-11-13</lastmod>
       <priority>1.0</priority>
     </url>
   </urlset>
   ```

3. **Add robots.txt**
   ```
   User-agent: *
   Allow: /
   Sitemap: https://yourdomain.com/sitemap.xml
   ```

4. **Optional: Add JSON-LD Structured Data**
   Add this before `</head>` for rich snippets:
   ```html
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "WebApplication",
     "name": "Car Lease Calculator",
     "description": "Free lease payment calculator to evaluate car lease deals",
     "url": "https://yourdomain.com/",
     "applicationCategory": "FinanceApplication",
     "offers": {
       "@type": "Offer",
       "price": "0",
       "priceCurrency": "USD"
     }
   }
   </script>
   ```

---

## Deployment Checklist

### Before Going Live

- [ ] Replace all `https://yourdomain.com/` with actual domain
- [ ] Add Buy Me a Coffee / donation link
- [ ] Insert ad network code (Google AdSense, etc.)
- [ ] Upload social media images (og-image.jpg, twitter-image.jpg)
- [ ] Test calculator functionality with various inputs
- [ ] Test on mobile devices
- [ ] Verify all links open in new tabs
- [ ] Check ad placements display correctly
- [ ] Submit sitemap to Google Search Console
- [ ] Test social media sharing (Facebook, Twitter, LinkedIn)

### Post-Launch

- [ ] Monitor ad performance
- [ ] Track donation conversions
- [ ] Check Google Analytics for user behavior
- [ ] Monitor search rankings for target keywords
- [ ] A/B test different CTA messages
- [ ] Gather user feedback
- [ ] Update meta description based on performance

---

## Customization Options

### Change Color Scheme
The current theme uses purple gradients. To change:

**Primary Gradient:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Button Hover Color:**
```css
border-color: #667eea;
background: #667eea;
```

### Adjust Scoring Rules
Modify the scoring logic in the `calculateScore()` function:

```javascript
// Current rules
const passes1PercentRule = totalMonthlyPayment <= onePercentOfMSRP;
const passesDownPaymentRule = downPayment === 0;
const passesNegotiationRule = savingsPercentage >= 5;
```

### Add More Input Fields
To add additional fields:
1. Add HTML input in the form
2. Get value in `calculateScore()` function
3. Add calculation logic
4. Display in results

---

## Analytics Setup (Optional)

### Google Analytics 4
Add before `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Calculator Usage
Add event tracking to the `calculateScore()` function:
```javascript
// After displaying results
if (typeof gtag !== 'undefined') {
    gtag('event', 'calculate_lease', {
        'deal_rating': dealRating,
        'score': score
    });
}
```

---

## Support & Maintenance

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Issues
None currently reported.

### Future Enhancements
- Add residual value calculator
- Include insurance cost estimates
- Compare multiple lease offers side-by-side
- Export results as PDF
- Save calculations to local storage
- Add lease vs buy comparison

---

## License & Credits

This calculator is provided as-is. Feel free to modify and customize for your needs.

**Built with:**
- Vanilla JavaScript (no dependencies)
- CSS3 with modern features
- Responsive design principles

---

## Contact

For questions or support, please visit [your contact page or email].

Last Updated: November 13, 2025
