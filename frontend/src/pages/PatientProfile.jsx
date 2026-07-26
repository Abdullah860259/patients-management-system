import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, fetchMe } from '../store/slices/authSlice';
import { User, Mail, Phone, Calendar, MapPin, Shield, AlertCircle, Stethoscope, Save, X, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const inputClass = "w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const sectionClass = "bg-white rounded-2xl p-6 shadow-sm border border-gray-100";

export default function PatientProfile() {
  const { user, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState({});
  const [showFields, setShowFields] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || ''
        },
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relationship: user.emergencyContact?.relationship || ''
        },
        dentalHistory: user.dentalHistory || '',
        allergies: user.allergies || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setChanged(prev => ({ ...prev, [field]: true }));
  };

  const handleAddressChange = (field, value) => {
    setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    setChanged(prev => ({ ...prev, address: true }));
  };

  const handleEmergencyChange = (field, value) => {
    setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    setChanged(prev => ({ ...prev, emergencyContact: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      address: form.address,
      emergencyContact: form.emergencyContact,
      dentalHistory: form.dentalHistory,
      allergies: form.allergies
    };
    const res = await dispatch(updateProfile(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(fetchMe());
      toast.success('Profile updated successfully');
      setChanged({});
    } else {
      toast.error(res.payload?.message || 'Update failed');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sectionClass}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
              <div className="flex items-center space-x-2 text-sm">
                <Shield size={14} className="text-gray-400" />
                <span className="text-gray-500 capitalize">{user.role}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">ID: {user.idNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User size={18} className="text-cyan-600" />
            <span>Personal Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" value={form.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)}
                className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" value={form.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)}
                className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email || ''} className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} disabled />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" value={form.dateOfBirth || ''} onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select value={form.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}
                className={inputClass}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <MapPin size={18} className="text-cyan-600" />
            <span>Address</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Street</label>
              <input type="text" value={form.address?.street || ''} onChange={(e) => handleAddressChange('street', e.target.value)}
                className={inputClass} placeholder="Street address" />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" value={form.address?.city || ''} onChange={(e) => handleAddressChange('city', e.target.value)}
                className={inputClass} placeholder="City" />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input type="text" value={form.address?.state || ''} onChange={(e) => handleAddressChange('state', e.target.value)}
                className={inputClass} placeholder="State" />
            </div>
            <div>
              <label className={labelClass}>ZIP Code</label>
              <input type="text" value={form.address?.zipCode || ''} onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                className={inputClass} placeholder="ZIP code" />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <AlertCircle size={18} className="text-cyan-600" />
            <span>Emergency Contact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" value={form.emergencyContact?.name || ''} onChange={(e) => handleEmergencyChange('name', e.target.value)}
                className={inputClass} placeholder="Contact name" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" value={form.emergencyContact?.phone || ''} onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                className={inputClass} placeholder="Contact phone" />
            </div>
            <div>
              <label className={labelClass}>Relationship</label>
              <input type="text" value={form.emergencyContact?.relationship || ''} onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                className={inputClass} placeholder="e.g. Spouse" />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Stethoscope size={18} className="text-cyan-600" />
            <span>Medical Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Dental History</label>
              <textarea value={form.dentalHistory || ''} onChange={(e) => handleChange('dentalHistory', e.target.value)}
                className={`${inputClass} min-h-[80px]`} placeholder="Past dental procedures, conditions, etc." />
            </div>
            <div>
              <label className={labelClass}>Allergies</label>
              <textarea value={form.allergies || ''} onChange={(e) => handleChange('allergies', e.target.value)}
                className={`${inputClass} min-h-[80px]`} placeholder="Medication allergies, sensitivities, etc." />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-md disabled:opacity-50 transition-all">
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
