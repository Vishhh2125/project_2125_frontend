import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation , useNavigate} from "react-router-dom";
import { fetchCurrentUser } from "./features/authSlice";
import StationMap from "./components/stationMap";
import StationList from "./components/stationList";
import StationModal from "./components/inputForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChargingStation, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Profile from "./components/Profile";
import { fetchChargingStations } from "./features/chargingStationSlice.js";

export default function ChargingStationLocator() {
  const navigate = useNavigate();
  const stations = useSelector((state) => state.chargingStations.stations);
  const user = useSelector((state) => state.auth.user);
  const stations_1 = stations ? stations : [];
  const filteredStations = stations_1.filter(
    (station) => station?.createdBy === user?._id
  );
  console.log("Filtered Stations:", filteredStations);

  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [edit, setEdit] = useState({ flag: null, station: null });
  const [formDefaults, setFormDefaults] = useState({
    name: "",
    status: "",
    powerOutput: "",
    connectorType: "",
    latitude: "",
    longitude: "",
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const mapRef = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
   useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchChargingStations());
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation(null)
      );
    }
  }, []);

  // Close profile popover when clicking outside
  useEffect(() => {
    if (!showProfile) return;
    const handleClick = (e) => {
      if (
        e.target.closest("#profile-popover") ||
        e.target.closest("#profile-btn")
      ) {
        return;
      }
      setShowProfile(false);
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  // Open modal for add
  const openAddModal = () => {
    setEdit({ flag: null, station: null });
    setFormDefaults({
      name: "",
      status: "",
      powerOutput: "",
      connectorType: "",
      latitude: "",
      longitude: "",
    });
    setSelectedLocation(null);
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (station) => {
    setEdit({ flag: station._id, station });
    setFormDefaults({
      name: station.name,
      status: station.status,
      powerOutput: station.powerOutput,
      connectorType: station.connectorType,
      latitude: station.location.latitude,
      longitude: station.location.longitude,
    });
    setSelectedLocation([
      station.location.latitude,
      station.location.longitude,
    ]);
    setShowModal(true);
  };

  // Handle add/edit submit
  const handleSubmit = async (data) => {
    // Always build the payload in the correct format
    const stationData = {
      name: data.name,
      status: data.status,
      powerOutput: Number(data.powerOutput),
      connectorType: data.connectorType,
      location: {
        latitude: Number(selectedLocation?.[0] ?? data.latitude),
        longitude: Number(selectedLocation?.[1] ?? data.longitude),
      },
    };

    if (edit.flag) {
      // Edit mode: dispatch update
      await dispatch(
        updateChargingStation({
          id: edit.flag,
          stationData,
        })
      );
    } else {
      // Add mode: dispatch create
      await dispatch(createChargingStation(stationData));
    }
    setShowModal(false);
    setEdit({ flag: null, station: null });
    setFormDefaults({
      name: "",
      status: "",
      powerOutput: "",
      connectorType: "",
      latitude: "",
      longitude: "",
    });
    setSelectedLocation(null);
    dispatch(fetchChargingStations());
  };

  const handleDeleteStation = (id) => {
    setStations((prev) => prev.filter((station) => station.id !== id));
  };

  const focusOnStation = (position) => {
    if (mapRef.current) {
      mapRef.current.setView(position, 15);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg relative">
        <div className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
          {/* Title in the center */}
          <h1 className="text-2xl font-bold text-white flex items-center drop-shadow">
            <FontAwesomeIcon icon={faChargingStation} className="inline mr-2" />
            EV Charge Finder
          </h1>
          {/* Right side: Add Station and Profile */}
          <div className="flex items-center gap-4 relative">
            <button
              onClick={openAddModal}
              className="bg-white border border-blue-600 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center font-semibold shadow"
            >
              Add Station
            </button>
            <button
              id="profile-btn"
              onClick={() => setShowProfile(prev => !prev)}
              className="focus:outline-none"
              title="Profile"
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-2xl text-white" />
            </button>
            {showProfile && (
              <div
                id="profile-popover"
                className="absolute right-0 top-12 z-50"
                style={{ minWidth: 220 }}
              >
                <Profile />
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-white rounded-none lg:rounded-l-lg shadow-md overflow-hidden relative">
          <StationMap stations={stations_1} userLocation={userLocation} mapRef={mapRef} />
        </div>
        <div className="w-full max-w-md bg-white rounded-none lg:rounded-r-lg shadow-md p-4 overflow-y-auto flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your stations</h2>
          <StationList
            stations={filteredStations}
            onEdit={openEditModal}
            onDelete={handleDeleteStation}
            onFocus={focusOnStation}
          />
        </div>
      </main>
      <StationModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEdit({ flag: null, station: null });
          setFormDefaults({
            name: "",
            status: "",
            powerOutput: "",
            connectorType: "",
            latitude: "",
            longitude: "",
          });
          setSelectedLocation(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={formDefaults}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        isEdit={!!edit.flag}
        editId={edit.flag}
      />
    </div>
  );
}