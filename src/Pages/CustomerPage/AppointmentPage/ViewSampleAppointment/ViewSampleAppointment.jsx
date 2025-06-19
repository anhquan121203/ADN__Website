import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSample from '../../../../Hooks/useSample';

const getInitial = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

const ViewSampleAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { getSamplesByAppointment, uploadPersonImage, submitSamples } = useSample();
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [notification, setNotification] = useState(null);
  

  const [selectedSampleIds, setSelectedSampleIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Auto-clear notification sau 3s
  useEffect(() => {
    if (notification) {
      const id = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(id);
    }
  }, [notification]);

  // Fetch samples
 // Fetch samples
 const fetchSamples = async () => {
  setLoading(true);
  try {
    const res = await getSamplesByAppointment(appointmentId);
    if (res.success) {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];
      setSamples(data);
    } else {
      setSamples([]);
    }
  } catch {
    setSamples([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (appointmentId) fetchSamples();
}, [appointmentId]);

  // Handle file select
  const handleImageChange = (sampleId, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedFiles(prev => ({ ...prev, [sampleId]: files }));
    const reader = new FileReader();
    reader.onload = ev => {
      setImages(prev => ({ ...prev, [sampleId]: ev.target.result }));
    };
    reader.readAsDataURL(files[0]);
  };

  // Upload và show notification
  const handleUpload = async (sampleId) => {
    const files = selectedFiles[sampleId];
    if (!files?.length) return;
    setUploading(prev => ({ ...prev, [sampleId]: true }));
    try {
      for (const file of files) {
        await uploadPersonImage(sampleId, file);
      }
      setSelectedFiles(prev => ({ ...prev, [sampleId]: undefined }));
      setNotification({ message: 'Upload thành công!', type: 'success' });
    } catch {
      setNotification({ message: 'Upload thất bại!', type: 'error' });
    }
    setUploading(prev => ({ ...prev, [sampleId]: false }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  const sampleArray = Array.isArray(samples) ? samples : [];
  if (!sampleArray.length) {
    return <div className="p-6">No samples found.</div>;
  }

  // Handle checkbox change
  const handleCheckboxChange = (sampleId, checked) => {
    setSelectedSampleIds(prev =>
      checked ? [...prev, sampleId] : prev.filter(id => id !== sampleId)
    );
  };

  // Handle submit
  const handleSubmitSamples = async () => {
    if (!selectedSampleIds.length) {
      setNotification({ message: 'Please select at least one sample!', type: 'error' });
      return;
    }
    
    // Get the first selected sample to use its collection date
    const firstSample = samples.find(sample => sample._id === selectedSampleIds[0]);
    if (!firstSample?.collection_date) {
      setNotification({ message: 'Selected sample has no collection date!', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    const res = await submitSamples(selectedSampleIds, firstSample.collection_date);
    if (res.success) {
      setNotification({ message: 'Submit successful!', type: 'success' });
      setSelectedSampleIds([]);
      fetchSamples();
    } else {
      setNotification({ message: 'Submit failed!', type: 'error' });
    }
    setSubmitting(false);
  };

  // If appointment is collected AND kit is used, hide all batch controls
  const appointmentStatus = sampleArray[0].appointment_id?.status;
  const kitStatus = sampleArray[0].kit_id?.status;
  const isBatchCompleted = appointmentStatus === 'sample_collected' || appointmentStatus === 'sample_received' && kitStatus === 'used';

  return (
    <div className="p-6 relative">
      {/* Toast notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            notification.type === 'success'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

    <div className="mb-6 flex items-center gap-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        Return
      </button>

      {appointmentStatus === "sample_received" && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() =>
            navigate("/payment", {
              state: {
                appointmentId,
                sampleIds: sampleArray.map((s) => s._id),
              },
            })
          }
        >
          Thanh toán
        </button>
      )}
    </div>

      <h2 className="text-2xl font-semibold mb-6">Sample List for Appointment</h2>

      {/* Batch submit controls */}
      {!isBatchCompleted && (
      <div className="flex items-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${selectedSampleIds.length ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!selectedSampleIds.length || submitting}
          onClick={handleSubmitSamples}
        >
          {submitting ? 'Submitting...' : 'Submit Selected Samples'}
        </button>
      </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {sampleArray.map(sample => {
          const person = sample.person_info || {};
          const imgSrc = sample.person_info?.image_url;
          const hasSelected = selectedFiles[sample._id]?.length > 0;
          const hideCheckbox = isBatchCompleted;

          return (
            <div
              key={sample._id}
              className="border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center bg-white"
            >
              {/* Checkbox for batch submit */}
              {!hideCheckbox && (
              <input
                type="checkbox"
                className="mb-2 w-4 h-4"
                checked={selectedSampleIds.includes(sample._id)}
                onChange={e => handleCheckboxChange(sample._id, e.target.checked)}
              />
              )}
              {/* Avatar */}
              <div className="relative mb-4 w-24 h-24">
                {imgSrc ? (
                  <img
                    src={person.image_url}
                    alt="Sample"
                    className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 border-2 border-gray-300 select-none">
                    {getInitial(person.name)}
                  </div>
                )}
                <label
                  htmlFor={`upload-${sample._id}`}
                  className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer shadow-sm"
                  title="Upload image"
                >
                  <input
                    id={`upload-${sample._id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={e => handleImageChange(sample._id, e)}
                  />
                  <span className="text-xl text-blue-600">📷</span>
                </label>
              </div>

              {/* Upload button */}
              <button
                className={`mb-2 px-3 py-1 rounded w-full ${
                  hasSelected
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasSelected || uploading[sample._id]}
                onClick={() => handleUpload(sample._id)}
              >
                {uploading[sample._id] ? 'Uploading...' : 'Upload'}
              </button>

              {/* Info */}
              <div className="w-full space-y-1 text-sm text-gray-700">
                <div><span className="font-medium">Sample ID:</span> {sample._id}</div>
                <div><span className="font-medium">Kit Code:</span> {sample.kit_id?.code}</div>
                <div><span className="font-medium">Type:</span> {sample.type}</div>
                <div><span className="font-medium">Method:</span> {sample.collection_method}</div>
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {sample.collection_date
                    ? new Date(sample.collection_date).toLocaleString()
                    : ''}
                </div>
                <div><span className="font-medium">Status:</span> {sample.status}</div>
                <div><span className="font-medium">Name:</span> {person.name}</div>
                <div>
                  <span className="font-medium">DOB:</span>{' '}
                  {person.dob ? new Date(person.dob).toLocaleDateString() : ''}
                </div>
                <div><span className="font-medium">Relationship:</span> {person.relationship}</div>
                <div><span className="font-medium">Birth Place:</span> {person.birth_place}</div>
                <div><span className="font-medium">Nationality:</span> {person.nationality}</div>
                <div><span className="font-medium">ID Doc:</span> {person.identity_document}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewSampleAppointment;
