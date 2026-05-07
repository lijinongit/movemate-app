/**
 * Detox E2E Test: Customer Registration Flow
 * Tests the complete onboarding journey from launch to verified account
 *
 * Scenario:
 * 1. User opens app → sees welcome screen
 * 2. Taps "Create Account"
 * 3. Enters email, password, name
 * 4. Receives OTP via email
 * 5. Enters OTP in app
 * 6. Account verified → home screen
 */

describe('Customer Registration Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display welcome screen on app launch', async () => {
    await expect(element(by.id('welcome-screen'))).toBeVisible();
    await expect(element(by.text('Welcome to Movemate'))).toBeVisible();
    await expect(element(by.id('btn-create-account'))).toBeVisible();
  });

  it('should navigate to registration form on "Create Account" tap', async () => {
    await element(by.id('btn-create-account')).tap();
    await expect(element(by.id('register-form'))).toBeVisible();
    await expect(element(by.text('Create Your Account'))).toBeVisible();
  });

  it('should display all registration form fields', async () => {
    await element(by.id('btn-create-account')).tap();

    // Email field
    await expect(element(by.id('input-email'))).toBeVisible();
    await expect(element(by.label('Email address'))).toBeVisible();

    // Password field
    await expect(element(by.id('input-password'))).toBeVisible();
    await expect(element(by.label('Password'))).toBeVisible();

    // First name
    await expect(element(by.id('input-first-name'))).toBeVisible();
    await expect(element(by.label('First name'))).toBeVisible();

    // Last name
    await expect(element(by.id('input-last-name'))).toBeVisible();
    await expect(element(by.label('Last name'))).toBeVisible();

    // Date of birth
    await expect(element(by.id('input-dob'))).toBeVisible();
    await expect(element(by.label('Date of birth'))).toBeVisible();

    // Language selector
    await expect(element(by.id('select-language'))).toBeVisible();

    // Submit button
    await expect(element(by.id('btn-register'))).toBeVisible();
  });

  it('should validate email format in real-time', async () => {
    await element(by.id('btn-create-account')).tap();

    // Invalid email
    await element(by.id('input-email')).typeText('notanemail');
    await element(by.id('input-email')).tapReturnKey();

    await expect(element(by.text('Please enter a valid email address'))).toBeVisible();
    await expect(element(by.id('input-email-error'))).toBeVisible();

    // Clear and enter valid email
    await element(by.id('input-email')).clearText();
    await element(by.id('input-email')).typeText('ali@example.com');

    await expect(element(by.text('Please enter a valid email address'))).not.toBeVisible();
  });

  it('should validate password strength', async () => {
    await element(by.id('btn-create-account')).tap();

    // Weak password
    await element(by.id('input-password')).typeText('weak');
    await element(by.id('input-password')).tapReturnKey();

    await expect(
      element(by.text('Password must be at least 8 characters'))
    ).toBeVisible();

    // Strong password
    await element(by.id('input-password')).clearText();
    await element(by.id('input-password')).typeText('SecurePass123!');

    await expect(
      element(by.text('Password must be at least 8 characters'))
    ).not.toBeVisible();
  });

  it('should register customer with valid email', async () => {
    await element(by.id('btn-create-account')).tap();

    // Fill form
    await element(by.id('input-email')).typeText('ali@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Ali');
    await element(by.id('input-last-name')).typeText('Ahmad');
    await element(by.id('input-dob')).typeText('1990-05-15');
    await element(by.id('select-language')).multiTap(1);
    await element(by.text('English')).tap();

    // Submit
    await element(by.id('btn-register')).multiTap(1);

    // Should navigate to OTP screen
    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.text('Verify Your Email'))).toBeVisible();
    await expect(element(by.text('We sent a code to ali@example.com'))).toBeVisible();
  });

  it('should display OTP input field', async () => {
    // Complete registration first
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('test@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Test');
    await element(by.id('input-last-name')).typeText('User');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // OTP input
    await expect(element(by.id('input-otp'))).toBeVisible();
    await expect(element(by.label('6-digit code'))).toBeVisible();

    // Verify button
    await expect(element(by.id('btn-verify-otp'))).toBeVisible();

    // Resend button
    await expect(element(by.id('btn-resend-otp'))).toBeVisible();
  });

  it('should validate OTP code format', async () => {
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('user@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('User');
    await element(by.id('input-last-name')).typeText('Test');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // Invalid OTP (less than 6 digits)
    await element(by.id('input-otp')).typeText('123');
    await element(by.id('btn-verify-otp')).multiTap(1);

    await expect(
      element(by.text('Please enter a 6-digit code'))
    ).toBeVisible();

    // Valid format
    await element(by.id('input-otp')).clearText();
    await element(by.id('input-otp')).typeText('123456');

    await expect(
      element(by.text('Please enter a 6-digit code'))
    ).not.toBeVisible();
  });

  it('should show error on incorrect OTP', async () => {
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('wrong@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Wrong');
    await element(by.id('input-last-name')).typeText('Code');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // Enter wrong OTP
    await element(by.id('input-otp')).typeText('000000');
    await element(by.id('btn-verify-otp')).multiTap(1);

    await expect(element(by.text('Invalid OTP code'))).toBeVisible();
    await expect(element(by.id('input-otp-error'))).toBeVisible();
  });

  it('should allow resending OTP', async () => {
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('resend@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Resend');
    await element(by.id('input-last-name')).typeText('User');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // Tap resend button
    await element(by.id('btn-resend-otp')).multiTap(1);

    // Should show confirmation
    await expect(element(by.text('Code sent to your email'))).toBeVisible();
  });

  it('should display countdown timer for OTP expiry', async () => {
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('timer@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Timer');
    await element(by.id('input-last-name')).typeText('Test');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // Check for timer display
    await expect(element(by.id('otp-timer'))).toBeVisible();
    await expect(element(by.text('Expires in'))).toBeVisible();
  });

  it('should navigate to home screen on successful verification', async () => {
    // This test would require mocking the OTP verification API
    // In a real scenario, you'd use a test OTP or mock backend
    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('success@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Success');
    await element(by.id('input-last-name')).typeText('User');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    await waitFor(element(by.id('otp-verification-screen')))
      .toBeVisible()
      .withTimeout(10000);

    // In real test, use valid OTP from test backend
    await element(by.id('input-otp')).typeText('123456');
    await element(by.id('btn-verify-otp')).multiTap(1);

    // Should see loading indicator
    await expect(element(by.id('verifying-spinner'))).toBeVisible();

    // Navigate to home screen
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await expect(element(by.text('What do you want to do today?'))).toBeVisible();
  });

  it('should handle network error gracefully', async () => {
    // Simulate network error
    await device.sendUserInteraction({
      type: 'networkError',
      error: 'Network timeout',
    });

    await element(by.id('btn-create-account')).tap();
    await element(by.id('input-email')).typeText('network@example.com');
    await element(by.id('input-password')).typeText('SecurePass123!');
    await element(by.id('input-first-name')).typeText('Network');
    await element(by.id('input-last-name')).typeText('Error');
    await element(by.id('input-dob')).typeText('1990-01-01');
    await element(by.id('btn-register')).multiTap(1);

    // Should show error message
    await expect(
      element(by.text('Unable to connect. Please check your internet.'))
    ).toBeVisible();

    // Retry button should be available
    await expect(element(by.id('btn-retry'))).toBeVisible();
  });

  it('should require all fields before enabling submit', async () => {
    await element(by.id('btn-create-account')).tap();

    // Register button should be disabled
    await expect(element(by.id('btn-register'))).toHaveToggleValue(false);

    // Fill email
    await element(by.id('input-email')).typeText('test@example.com');
    await expect(element(by.id('btn-register'))).toHaveToggleValue(false);

    // Fill password
    await element(by.id('input-password')).typeText('SecurePass123!');
    await expect(element(by.id('btn-register'))).toHaveToggleValue(false);

    // Fill names
    await element(by.id('input-first-name')).typeText('Test');
    await element(by.id('input-last-name')).typeText('User');
    await expect(element(by.id('btn-register'))).toHaveToggleValue(false);

    // Fill DOB
    await element(by.id('input-dob')).typeText('1990-01-01');

    // Should be enabled now
    await expect(element(by.id('btn-register'))).toHaveToggleValue(true);
  });

  it('should support Arabic language selection', async () => {
    await element(by.id('btn-create-account')).tap();
    await element(by.id('select-language')).multiTap(1);
    await element(by.text('العربية')).tap();

    // All text should be in Arabic and RTL
    await expect(element(by.text('إنشاء حسابك'))).toBeVisible();
    await expect(element(by.id('register-form'))).toHaveAtIndex(
      'accessibilityValue.direction',
      'rtl'
    );
  });
});
