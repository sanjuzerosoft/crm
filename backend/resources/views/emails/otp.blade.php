<!DOCTYPE html>
<html>
<head>
    <title>Your OTP Code</title>
</head>
<body>
    <h1>Hello {{ $user->name }},</h1>
    <p>Your OTP code for login is: <strong>{{ $otp }}</strong></p>
    <p>This code will expire in 10 minutes.</p>
</body>
</html>
