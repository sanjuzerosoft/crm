# TODO: Implement User Registration and Login with Email Verification and OTP

## Database Changes
- [x] Create migration to add 'status' (tinyInteger, default 0), 'otp' (string, nullable), 'otp_expires_at' (timestamp, nullable) to users table.
- [x] Update User model to include new fields in fillable.

## Email Setup
- [x] Create app/Mail/VerificationEmail.php mail class.
- [x] Create app/Mail/OtpEmail.php mail class.
- [x] Create resources/views/emails/verification.blade.php view.
- [x] Create resources/views/emails/otp.blade.php view.

## AuthController Updates
- [x] Modify register method: Set status=0, generate verification token, send verification email.
- [x] Add verify method: Handle verification link, update status to 1.
- [x] Modify login method: Check status=1, if yes, generate OTP, send to email, return message to enter OTP.
- [x] Add verifyOtp method: Check OTP, if valid, return JWT token.

## Routes
- [x] Add POST /verify-email and POST /verify-otp routes in routes/api.php.

## Followup
- [x] Run migrations.
- [ ] Configure mail settings if not done.
- [ ] Test the endpoints.
