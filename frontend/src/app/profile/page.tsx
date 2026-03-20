'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useStore } from '@/store/appStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useStore();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setName(user.name);
    }
  }, [user, router]);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>

            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.phone}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold text-gray-800">{(user.rating ?? 0).toFixed(1)}</span>
                  <span className="text-sm text-gray-500">overall rating</span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="pt-6 border-t space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input value={user.phone} disabled />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <Input value={user.role === 'DRIVER' ? 'Driver' : 'Rider'} disabled />
              </div>
            </div>

            {/* Stats */}
            <div className="pt-6 border-t grid grid-cols-2 gap-4">
              <Card className="!p-4 bg-gray-50">
                <p className="text-xs text-gray-500 uppercase">Trips</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </Card>
              <Card className="!p-4 bg-gray-50">
                <p className="text-xs text-gray-500 uppercase">Reviews</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t flex gap-4">
              <Button
                variant="secondary"
                full
                onClick={() => router.push(user.role === 'DRIVER' ? '/trips' : '/search')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
