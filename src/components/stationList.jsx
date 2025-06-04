import { Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteChargingStation,fetchChargingStations } from "../features/chargingStationSlice.js";
const StationList = ({ stations, onEdit, onDelete, onFocus }) => {

    const dispatch = useDispatch();

    const handleDeleteStation=(id)=>{
        try {
            dispatch(deleteChargingStation(id));
            dispatch(fetchChargingStations());
            
        console.log("Station deleted successfully");

        } catch (error) {
            console.error("Failed to delete station:", error);
        }

    }
  return (
    <div>
      {stations.map((station) => (
        <div
          key={station._id}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex flex-col"
            //   onClick={() => onFocus(station.position)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{station.name}</h3>
              <p className="text-sm text-gray-600">
                  {station.powerOutput} kW
              </p>
            </div>
            <span className={`text-sm font-medium ${station.status? "text-green-600" : "text-red-600"}`}>
              {station.connectorType}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>{station.status ? "Available now" : "Currently in use"}</span>
            
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              onClick={() => {
                
                onEdit(station);
              }}
            >
              <Pencil size={14} className="mr-1" /> Edit
            </button>
            <button
              className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              onClick={() => {
                handleDeleteStation(station._id);
                
              }}
            >
              <Trash2 size={14} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StationList;