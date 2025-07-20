import { notification } from 'antd';
import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Libraries needed for Google Maps
const libraries = ['places'];

// Google Maps Component
export const GoogleMapPicker = ({ onAddressSelect, onClose, initialAddress = '' }) => {
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [markerPosition, setMarkerPosition] = useState({ lat: 10.8231, lng: 106.6297 }); // Ho Chi Minh City
  const [searchBox, setSearchBox] = useState(null);

  // Use useJsApiLoader hook instead of LoadScript
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  // Map options
  const mapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoom: 13
  };

  const onLoad = useCallback((map) => {
    // Map loaded successfully
  }, []);

  const onUnmount = useCallback(() => {
    // Map unmounted
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });

    notification.info({
      message: 'Đang cập nhật địa chỉ...',
      description: 'Vui lòng chờ trong giây lát',
      duration: 1,
    });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setSelectedAddress(address);

        if (searchBox) {
          const input = searchBox.getInputElement();
          if (input) {
            input.value = address;
          }
        }

        notification.success({
          message: 'Đã cập nhật địa chỉ',
          description: address,
          duration: 2,
        });
      } else {
        console.error('Geocoding failed:', status);
        notification.error({
          message: 'Lỗi',
          description: status === 'REQUEST_DENIED' 
            ? 'API key không có quyền sử dụng Geocoding API. Vui lòng kiểm tra cấu hình API key.' 
            : 'Không thể lấy địa chỉ từ vị trí này.',
        });
      }
    });
  }, [searchBox]);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });

    notification.info({
      message: 'Đang lấy địa chỉ...',
      description: 'Vui lòng chờ trong giây lát',
      duration: 1,
    });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address;
        setSelectedAddress(address);

        if (searchBox) {
          const input = searchBox.getInputElement();
          if (input) {
            input.value = address;
          }
        }

        notification.success({
          message: 'Đã chọn địa chỉ',
          description: address,
          duration: 2,
        });
      } else {
        console.error('Geocoding failed:', status);
        notification.error({
          message: 'Lỗi',
          description: status === 'REQUEST_DENIED' 
            ? 'API key không có quyền sử dụng Geocoding API. Vui lòng kiểm tra cấu hình API key.' 
            : 'Không thể lấy địa chỉ từ vị trí này.',
        });
      }
    });
  }, [searchBox]);

  const onSearchBoxLoad = useCallback((ref) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
        setSelectedAddress(place.formatted_address || place.name);
      }
    }
  }, [searchBox]);

  const handleConfirm = () => {
    if (selectedAddress && onAddressSelect) {
      onAddressSelect(selectedAddress);
    }
    onClose();
  };

  const handleLoadError = () => {
    notification.error({
      message: 'Lỗi tải Google Maps',
      description: 'Vui lòng kiểm tra kết nối internet và API key. Đảm bảo rằng API key có quyền sử dụng Geocoding API và Places API.',
    });
  };

  // Show error if loading failed
  if (loadError) {
    handleLoadError();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
          <h3 className="text-xl font-semibold">Chọn địa chỉ trên bản đồ</h3>
        </div>

        {/* Loading state */}
        {!isLoaded && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải bản đồ...</p>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        {isLoaded && (
          <>
            {/* Instructions */}
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  Nhấp vào bản đồ hoặc kéo thả marker để chọn địa chỉ
                </span>
              </div>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-gray-200">
              <StandaloneSearchBox
                onLoad={onSearchBoxLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Hoặc tìm kiếm địa điểm..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </StandaloneSearchBox>
            </div>

            <div className="relative">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onMapClick}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={onMarkerDragEnd}
                  animation={window.google?.maps?.Animation?.BOUNCE}
                />
              </GoogleMap>
              
              {/* Quick action button */}
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={() => {
                    if (selectedAddress) {
                      handleConfirm();
                    } else {
                      notification.warning({
                        message: 'Chưa chọn địa chỉ',
                        description: 'Vui lòng nhấp vào bản đồ để chọn địa chỉ',
                      });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all ${
                    selectedAddress 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Chọn nhanh
                </button>
              </div>
            </div>
          </>
        )}

        {/* Selected Address */}
        {selectedAddress && (
          <div className="p-4 bg-blue-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Địa chỉ đã chọn:</p>
            <p className="font-medium text-gray-800">{selectedAddress}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAddress}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for using Google Maps (simplified)
export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  return { isLoaded, loadError };
};

export default GoogleMapPicker;
