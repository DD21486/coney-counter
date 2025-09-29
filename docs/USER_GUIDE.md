# Coney Verification System - User Guide

## What is the Coney Verification System?

The Coney Verification System automatically reads your receipt and fills in your coney log for you! Just take a photo of your receipt and we'll extract all the important information like how many coneys you had, which restaurant, and when you visited.

## How to Use It

### Step 1: Choose Upload Mode
1. Go to the "Log a Coney" page
2. Look for the toggle at the top that says "Manual Entry" and "Upload Receipt"
3. Click on "Upload Receipt" to switch to photo mode

### Step 2: Take a Photo
1. Click the upload area or "Choose File" button
2. **On your phone**: Your camera will open automatically
3. **On your computer**: A file picker will open to select a photo

### Step 3: Wait for Processing
- You'll see a progress indicator showing "Processing receipt..."
- This usually takes 10-30 seconds
- The system is reading all the text from your receipt

### Step 4: Review Extracted Data
- If successful, you'll see a green box with the extracted information
- Check that the brand and quantity look correct
- The form will be automatically filled in for you

### Step 5: Submit or Edit
- If everything looks good, click "Log This Coney"
- If something looks wrong, you can edit the form or switch back to manual entry

## Tips for Best Results

### 📸 Taking Good Photos

**Do:**
- ✅ Take the photo in good lighting
- ✅ Keep the receipt flat and unfolded
- ✅ Make sure all text is clearly visible
- ✅ Include the entire receipt in the photo
- ✅ Hold your phone steady

**Don't:**
- ❌ Take photos in the dark
- ❌ Fold or crumple the receipt
- ❌ Let shadows cover the text
- ❌ Cut off parts of the receipt
- ❌ Take blurry photos

### 🏪 Receipt Types That Work Best

**Great Results:**
- ✅ Printed receipts from restaurants
- ✅ Clear, readable text
- ✅ Standard receipt format

**May Need Manual Entry:**
- ⚠️ Handwritten receipts
- ⚠️ Very faded or damaged receipts
- ⚠️ Receipts with unusual formatting

## What Information Gets Extracted

### ✅ Always Extracted
- **Brand**: Which restaurant (Skyline, Gold Star, etc.)
- **Quantity**: How many coneys you had
- **Date**: When you visited
- **Time**: What time you visited (if on receipt)

### ✅ Sometimes Extracted
- **Total Amount**: How much you spent
- **Check Number**: Receipt number (for duplicate prevention)
- **Location**: Specific restaurant location

### 📊 Confidence Score
- **High Confidence (80%+)**: Information is very likely correct
- **Medium Confidence (50-79%)**: Information is probably correct, but double-check
- **Low Confidence (<50%)**: Information is uncertain, manual verification needed

## Supported Restaurants

The system recognizes receipts from these Cincinnati chili restaurants:

- **Skyline Chili** - All locations
- **Gold Star Chili** - All locations  
- **Dixie Chili** - All locations
- **Camp Washington Chili**
- **Empress Chili**
- **Price Hill Chili**
- **Pleasant Ridge Chili**
- **Blue Ash Chili**

*Don't see your favorite spot? Use manual entry or suggest it to us!*

## Understanding Different Receipt Formats

### Skyline Chili Receipt
```
Skyline Chili
Norwood
4588 Montgomery Rd. Cincinnati, OH 45212

Date: 9/28/2025
Time: 1:11:24 PM
Check: 646190

2 Cheese Coney PL      5.98
1 MED Coke             2.89

Total: 17.16
```
**Extracts**: 2 coneys from Skyline Chili

### Gold Star Receipt
```
Gold Star Chili
Downtown Cincinnati
28 W 4th St, Cincinnati, OH

Order #12345
3-Way                 8.50
2 Cheese Coneys       6.00

Total: 14.50
```
**Extracts**: 3 coneys total (1 from 3-Way + 2 Cheese Coneys)

## Troubleshooting

### "OCR processing failed"
**What it means**: The system couldn't read your receipt
**What to do**: 
- Try taking a clearer photo with better lighting
- Make sure the receipt is flat and unfolded
- Switch to manual entry if it keeps failing

### "Low confidence extraction"
**What it means**: The system read the receipt but isn't sure about the data
**What to do**:
- Check the extracted information carefully
- Edit any incorrect fields
- The system will still work, just verify the data

### "Brand not recognized"
**What it means**: The system doesn't recognize this restaurant
**What to do**:
- Use manual entry to select the brand
- Let us know about the restaurant so we can add it

### "Quantity not detected"
**What it means**: The system couldn't find how many coneys you had
**What to do**:
- Check if the receipt clearly shows the coney items
- Manually enter the quantity
- Try a different photo if the text is unclear

## Privacy and Security

### 🔒 Your Data is Safe
- **Images are processed locally** on your device
- **No images are stored** on our servers
- **Only extracted text** is sent to our system
- **Receipts are deleted** immediately after processing

### 📱 What We Store
- Brand name
- Quantity of coneys
- Date and time
- Total amount (for duplicate prevention)
- Check number (for duplicate prevention)

### 🚫 What We Don't Store
- Receipt images
- Personal information from receipts
- Credit card numbers
- Other purchase details

## Frequently Asked Questions

### Q: Why is it taking so long to process?
A: The first time you use it, the system needs to download language models (about 10-20MB). After that, processing is much faster (10-30 seconds).

### Q: Can I use this on any receipt?
A: It works best with printed receipts from Cincinnati chili restaurants. Handwritten or damaged receipts may not work as well.

### Q: What if the system gets something wrong?
A: You can always edit the form before submitting, or switch back to manual entry. The system is designed to help, not replace your judgment.

### Q: Will this work offline?
A: The OCR processing happens on your device, so it works without internet. However, you'll need internet to submit the log to our servers.

### Q: Can I upload multiple receipts at once?
A: Currently, you can only process one receipt at a time. This helps ensure accuracy and prevents confusion.

### Q: What if I don't have a receipt?
A: No problem! Just use manual entry to log your coneys the traditional way.

## Getting Help

### 🆘 Need Support?
- **Technical Issues**: Check your internet connection and try again
- **Feature Requests**: Contact us through the app
- **Bug Reports**: Let us know what went wrong and we'll fix it

### 💡 Suggestions
- **New Restaurants**: Tell us about restaurants we should add
- **Improvements**: Share ideas for making the system better
- **Feedback**: We love hearing from users!

---

*Happy coney logging! 🌭*

*This user guide is part of the Coney Counter app documentation.*
