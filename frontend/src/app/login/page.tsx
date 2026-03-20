'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useApi';
import { useStore } from '@/store/appStore';

type Step = 'phone' | 'otp' | 'name';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useStore();
  const { sendOTP, verifyOTP, checkUser } = useAuth();
  const { isLoading, error, setError } = useStore();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'DRIVER' | 'RIDER'>('RIDER');
  const [mockOTP, setMockOTP] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'DRIVER') {
        router.push('/trips');
      } else {
        router.push('/search');
      }
    }
  }, [user, router]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      setError('Phone number is required');
      return;
    }

    try {
      const result = await sendOTP(phone);
      setMockOTP(result.mockOTP || '');
      setStep('otp');
      setError(null);
    } catch (err) {
      // Error is already set by the hook
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    // If we're at otp step and haven't checked if user exists yet
    if (step === 'otp') {
      try {
        // Check if user already exists in the system
        const userCheckResult = await checkUser(phone);
        
        if (userCheckResult.exists) {
          // Existing user - skip name form and verify OTP directly
          await verifyOTP(phone, otp);
          setError(null);
          router.push(userCheckResult.user.role === 'DRIVER' ? '/trips' : '/search');
        } else {
          // New user - ask for name first
          setStep('name');
        }
      } catch (err) {
        // Error is already set by the hook
      }
      return;
    }

    // Name step - verify OTP with name and role
    try {
      await verifyOTP(phone, otp, name, role);
      setError(null);
      router.push(role === 'DRIVER' ? '/trips' : '/search');
    } catch (err) {
      // Error is already set by the hook
      setStep('otp'); // If verification fails, go back to OTP step
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🚗 Carpool</h1>
          <p className="text-orange-100">Share your ride, save money</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

          <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-5">
            {/* Phone number step */}
            {step === 'phone' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Login with Phone</h2>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  label="Phone Number"
                />
                <p className="text-xs text-gray-500 mt-2">Format: 1234567890</p>
                <Button type="submit" variant="primary" full loading={isLoading}>
                  Send OTP
                </Button>
              </div>
            )}

            {/* OTP step */}
            {step === 'otp' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                <p className="text-gray-600 text-sm mb-4">
                  We've sent an OTP to {phone}
                  {mockOTP && ` (Test OTP: ${mockOTP})`}
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  label="OTP"
                />
                <div className="mt-4 space-y-3">
                  <Button type="submit" variant="primary" full loading={isLoading}>
                    {name ? 'Continue' : 'Verify OTP'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    full
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                      setName('');
                    }}
                  >
                    Change Phone
                  </Button>
                </div>
              </div>
            )}

            {/* Name and role step */}
            {step === 'name' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Complete Your Profile</h2>

                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Full Name"
                />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="RIDER"
                        checked={role === 'RIDER'}
                        onChange={(e) => setRole(e.target.value as 'RIDER')}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-700">Rider (Book rides)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="DRIVER"
                        checked={role === 'DRIVER'}
                        onChange={(e) => setRole(e.target.value as 'DRIVER')}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-gray-700">Driver (Create trips)</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" variant="primary" full loading={isLoading} className="mt-6">
                  Get Started
                </Button>
              </div>
            )}
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By logging in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
