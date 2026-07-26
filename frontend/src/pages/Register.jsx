import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import StepOne from '../components/auth/StepOne';
import StepTwo from '../components/auth/StepTwo';
import { UserPlus } from 'lucide-react';

const initial = { firstName: '', lastName: '', email: '', password: '', phone: '', dateOfBirth: '', gender: 'male' };

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('Account created!');
      navigate('/patient/dashboard');
    } else {
      toast.error(result.payload?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join DentalCare and manage your dental health</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                <span className={`ml-2 text-sm font-medium ${step >= s ? 'text-cyan-600' : 'text-gray-400'}`}>{s === 1 ? 'Personal Info' : 'Account Setup'}</span>
                {s < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > 1 ? 'bg-cyan-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? <StepOne form={form} onChange={handleChange} /> : <StepTwo form={form} onChange={handleChange} />}
            <div className="flex gap-3 pt-2">
              {step === 2 && <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600">Back</button>}
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-50">
                {loading ? 'Creating...' : step === 1 ? 'Next Step' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-cyan-600 font-semibold">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
