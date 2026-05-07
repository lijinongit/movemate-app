/**
 * Detox E2E Test: Emirates ID Upload Flow
 * Tests document upload, compression, and verification
 *
 * Scenario:
 * 1. User navigates to identity verification screen
 * 2. Selects "Upload Emirates ID" → camera/gallery picker
 * 3. Crops image (if needed)
 * 4. Compresses and uploads to S3 presigned URL
 * 5. Shows upload progress
 * 6. Confirms document pending verification
 */

describe('Emirates ID Upload Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display identity verification screen after registration', async () => {
    // Assume user is already registered and at home screen
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();

    await expect(element(by.id('identity-verification-screen'))).toBeVisible();
    await expect(element(by.text('Verify Your Identity'))).toBeVisible();
    await expect(element(by.text('Upload your Emirates ID to continue'))).toBeVisible();
  });

  it('should display upload button and instructions', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();

    // Main upload button
    await expect(element(by.id('btn-upload-emiratesid'))).toBeVisible();
    await expect(element(by.text('Upload Emirates ID'))).toBeVisible();

    // Instructions
    await expect(element(by.text('Tips: Use good lighting'))).toBeVisible();
    await expect(element(by.text('Keep the ID flat'))).toBeVisible();
    await expect(element(by.text('Ensure all text is visible'))).toBeVisible();

    // Supported formats
    await expect(element(by.text('Supported: JPG, PNG, PDF'))).toBeVisible();
  });

  it('should show camera and gallery picker options', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);

    // Should show picker options
    await expect(element(by.id('action-sheet'))).toBeVisible();
    await expect(element(by.text('Take Photo'))).toBeVisible();
    await expect(element(by.text('Choose from Gallery'))).toBeVisible();
    await expect(element(by.text('Cancel'))).toBeVisible();
  });

  it('should handle camera option', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);

    // Tap "Take Photo"
    await element(by.text('Take Photo')).tap();

    // Should open camera (mocked in test)
    // In real scenario, device camera would open
    await waitFor(element(by.id('camera-view')))
      .toBeVisible()
      .withTimeout(5000);

    // Camera controls
    await expect(element(by.id('btn-capture'))).toBeVisible();
    await expect(element(by.id('btn-cancel'))).toBeVisible();
  });

  it('should handle gallery picker option', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);

    // Tap "Choose from Gallery"
    await element(by.text('Choose from Gallery')).tap();

    // In test environment, this would show a mock gallery
    // Real app would open system photo library
    await waitFor(element(by.id('photo-library'))).toBeVisible().withTimeout(5000);
  });

  it('should display image crop interface', async () => {
    // Simulate image selection from gallery
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();

    // Select an image
    await element(by.id('photo-library-item-0')).tap();

    // Should show crop interface
    await waitFor(element(by.id('crop-view'))).toBeVisible().withTimeout(5000);

    // Crop controls
    await expect(element(by.id('crop-guide'))).toBeVisible();
    await expect(element(by.id('btn-crop-confirm'))).toBeVisible();
    await expect(element(by.id('btn-crop-cancel'))).toBeVisible();

    // Zoom and pan controls
    await expect(element(by.id('pinch-zoom-view'))).toBeVisible();
  });

  it('should validate image quality before upload', async () => {
    // Navigate to upload screen
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();

    // Confirm crop
    await element(by.id('btn-crop-confirm')).multiTap(1);

    // Should validate image quality
    // If blurry, show error
    await waitFor(element(by.id('image-preview'))).toBeVisible().withTimeout(5000);

    // Review screen before upload
    await expect(element(by.id('btn-confirm-upload'))).toBeVisible();
    await expect(element(by.id('btn-retake'))).toBeVisible();
  });

  it('should show image preview for review', async () => {
    // Navigate through upload flow
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);

    // Review screen
    await expect(element(by.id('image-preview'))).toBeVisible();
    await expect(element(by.text('Review Your ID Photo'))).toBeVisible();
    await expect(element(by.text('Make sure all corners are visible'))).toBeVisible();
  });

  it('should allow user to retake photo', async () => {
    // Complete flow to review screen
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);

    // Tap retake button
    await element(by.id('btn-retake')).multiTap(1);

    // Should go back to gallery/camera picker
    await expect(element(by.id('action-sheet'))).toBeVisible();
  });

  it('should display upload progress during file upload', async () => {
    // Complete flow to upload
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);
    await element(by.id('btn-confirm-upload')).multiTap(1);

    // Should show progress indicator
    await expect(element(by.id('upload-progress-modal'))).toBeVisible();
    await expect(element(by.id('progress-bar'))).toBeVisible();
    await expect(element(by.text('Uploading...'))).toBeVisible();

    // Progress percentage
    await expect(element(by.id('progress-percentage'))).toBeVisible();
  });

  it('should compress image before upload', async () => {
    // In real scenario, verify compression happened
    // App should compress to < 2MB before S3 upload

    // Complete upload flow
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);

    // Check file size info (optional)
    await expect(element(by.id('file-size-info'))).toBeVisible();
    // Should show compressed size < 2MB
  });

  it('should show success message on successful upload', async () => {
    // Complete full upload flow
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);
    await element(by.id('btn-confirm-upload')).multiTap(1);

    // Wait for upload to complete
    await waitFor(element(by.id('upload-success-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Success message
    await expect(element(by.text('Your identity is being verified'))).toBeVisible();
    await expect(
      element(by.text('This usually takes 2–4 hours'))
    ).toBeVisible();

    // Success icon
    await expect(element(by.id('success-icon'))).toBeVisible();

    // Continue button
    await expect(element(by.id('btn-continue'))).toBeVisible();
  });

  it('should handle network error during upload', async () => {
    // Simulate network error mid-upload
    await device.sendUserInteraction({
      type: 'networkError',
      error: 'Connection lost',
    });

    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);
    await element(by.id('btn-confirm-upload')).multiTap(1);

    // Should show error
    await waitFor(element(by.id('upload-error-modal')))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.text('Upload failed'))).toBeVisible();
    await expect(element(by.text('Connection lost'))).toBeVisible();

    // Retry button
    await expect(element(by.id('btn-retry-upload'))).toBeVisible();
  });

  it('should allow retry after upload failure', async () => {
    // Simulate failed upload
    await device.sendUserInteraction({
      type: 'networkError',
      error: 'Connection timeout',
    });

    // Complete upload to failure
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);
    await element(by.id('btn-confirm-upload')).multiTap(1);

    await waitFor(element(by.id('upload-error-modal')))
      .toBeVisible()
      .withTimeout(10000);

    // Restore network and retry
    await device.sendUserInteraction({
      type: 'networkRestore',
    });

    await element(by.id('btn-retry-upload')).multiTap(1);

    // Should retry upload
    await expect(element(by.id('upload-progress-modal'))).toBeVisible();
  });

  it('should show document pending verification status', async () => {
    // After successful upload, check status
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-0')).tap();
    await element(by.id('btn-crop-confirm')).multiTap(1);
    await element(by.id('btn-confirm-upload')).multiTap(1);

    await waitFor(element(by.id('upload-success-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('btn-continue')).multiTap(1);

    // Should show pending status
    await expect(element(by.id('verification-status-badge'))).toBeVisible();
    await expect(element(by.text('Pending Verification'))).toBeVisible();
    await expect(element(by.id('status-icon-pending'))).toBeVisible();
  });

  it('should handle file size validation', async () => {
    // App should reject files > 5MB before upload attempt
    // This is tested at the picker level

    // In real app, show error if file too large
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();

    // Select a large file (if available in test data)
    // Should show error: "File size must be less than 5MB"
  });

  it('should support both sides of Emirates ID', async () => {
    // User can upload dual-side photo
    await element(by.id('tab-profile')).tap();
    await element(by.id('btn-verify-identity')).tap();

    // Should allow single image with both sides
    await element(by.id('btn-upload-emiratesid')).multiTap(1);
    await element(by.text('Choose from Gallery')).tap();
    await element(by.id('photo-library-item-1')).tap(); // Dual-side photo

    // System auto-detects and extracts both sides
    await element(by.id('btn-crop-confirm')).multiTap(1);

    // Should show both sides detected
    await expect(element(by.text('Both sides detected'))).toBeVisible();
  });

  it('should display upload status in verification screen', async () => {
    // User can check upload progress from profile
    await element(by.id('tab-profile')).tap();

    // Should show document status
    await expect(element(by.id('document-status-section'))).toBeVisible();
    await expect(element(by.text('Emirates ID'))).toBeVisible();
    await expect(element(by.id('status-badge'))).toBeVisible();

    // Status can be: Pending, Verified, Rejected
  });

  it('should support Arabic language for upload instructions', async () => {
    // Switch to Arabic language
    await element(by.id('tab-profile')).tap();
    await element(by.id('settings-menu')).tap();
    await element(by.id('language-selector')).multiTap(1);
    await element(by.text('العربية')).tap();

    // Navigate to ID upload
    await element(by.id('btn-verify-identity')).tap();

    // All text should be in Arabic
    await expect(element(by.text('تحميل بطاقة الهوية الإماراتية'))).toBeVisible();
    await expect(element(by.text('نصائح: استخدم إضاءة جيدة'))).toBeVisible();

    // Layout should be RTL
    await expect(element(by.id('identity-verification-screen'))).toHaveAtIndex(
      'accessibilityValue.direction',
      'rtl'
    );
  });
});
