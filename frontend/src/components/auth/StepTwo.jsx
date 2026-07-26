import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function StepTwo({ form, onChange }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type={showPass ? 'text' : 'password'} name="password" required minLength={6}
            className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white"
            placeholder="Min. 6 characters" value={form.password} onChange={onChange} />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="bg-cyan-50 p-4 rounded-xl">
        <h4 className="text-sm font-semibold text-cyan-800 mb-2">Quick Summary</h4>
        <div className="text-sm text-cyan-700 space-y-1">
          <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>DOB:</strong> {form.dateOfBirth}</p>
        </div>
      </div>
    </>
  );
}
