import { useForm } from "react-hook-form";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "./LocationPicker";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createChargingStation,
  updateChargingStation,
  fetchChargingStations,
} from "../features/chargingStationSlice";

const connectorTypes = [
  "Type 1 (SAE J1772)",
  "Type 2 (Mennekes)",
  "CCS Type 2",
  "DC Fast",
  "Standard Domestic",
];

const statusOptions = ["Active", "Inactive"];

const StationModal = ({
  show,
  onClose,
  defaultValues,
  selectedLocation,
  setSelectedLocation,
  isEdit,
  editId, // pass station id if editing, null if adding
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  // Keep form in sync with modal open/close and default values
  useEffect(() => {
    reset(defaultValues);
    if (defaultValues.latitude && defaultValues.longitude) {
      setSelectedLocation([defaultValues.latitude, defaultValues.longitude]);
    }
  }, [defaultValues, reset, show, setSelectedLocation]);

  // Update latitude/longitude fields when map selection changes
  useEffect(() => {
    if (selectedLocation) {
      setValue("latitude", selectedLocation[0]);
      setValue("longitude", selectedLocation[1]);
    }
  }, [selectedLocation, setValue]);

  if (!show) return null;

  const onFormSubmit = async (data) => {
    if (!selectedLocation) {
      alert("Please select a location on the map");
      return;
    }
    const stationData = {
      name: data.name,
      location: {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      },
      status: data.status,
      powerOutput: Number(data.powerOutput),
      connectorType: data.connectorType,
    };

    if (isEdit && editId) {
      // Edit mode
      await dispatch(
        updateChargingStation({
          id: editId,
          stationData,
        })
      );
    } else {
      // Add mode
      await dispatch(createChargingStation(stationData));
    }
    await dispatch(fetchChargingStations());
    onClose();
    reset();
    setSelectedLocation(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Charging Station" : "Add New Charging Station"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Click on the map to select location</p>
          <div style={{ height: "200px" }} className="mb-4 rounded-lg border border-gray-200 overflow-hidden">
            <MapContainer
              center={selectedLocation || [28.6139, 77.2090]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </MapContainer>
          </div>
          <p className="text-sm text-gray-600 italic">
            {selectedLocation
              ? `Selected: ${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)}`
              : "No location selected"}
          </p>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Station Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Station name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              {...register("status", { required: "Status is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select status</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
          </div>
          <div>
            <label htmlFor="powerOutput" className="block text-sm font-medium text-gray-700 mb-1">
              Power Output (kW)
            </label>
            <input
              type="number"
              id="powerOutput"
              {...register("powerOutput", { required: "Power output is required", min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.powerOutput && <p className="text-red-500 text-xs">{errors.powerOutput.message}</p>}
          </div>
          <div>
            <label htmlFor="connectorType" className="block text-sm font-medium text-gray-700 mb-1">
              Connector Type
            </label>
            <select
              id="connectorType"
              {...register("connectorType", { required: "Connector type is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select connector type</option>
              {connectorTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.connectorType && <p className="text-red-500 text-xs">{errors.connectorType.message}</p>}
          </div>
          {/* Hidden fields for latitude/longitude, kept in sync with map */}
          <input type="hidden" {...register("latitude", { required: true })} />
          <input type="hidden" {...register("longitude", { required: true })} />
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              disabled={isSubmitting}
            >
              {isEdit ? "Save Changes" : "Add Station"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationModal;