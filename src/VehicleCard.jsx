import "./VehicleCard.css";

function VehicleCard({ index, vehicleImg, vehicleName, vehicleNum, lat, long, driverImg, driverName, driverNum }) {
  const handleDetails = () => {
    console.log(driverImg);
    console.log(driverName);
    console.log(driverNum);
  };

  return (
    <>
      <div className="vehicle-card">
        <div className="vehicle-map"></div>
        <div className="vehicle-content">
          <img src={vehicleImg} alt="Truck Image" className="vehicle-img" />
          <div className="vehicle-name-id">
            <div className="vehicle-name">{vehicleName}</div>
            <div className="vehicle-id">{vehicleNum}</div>
          </div>
          <div className="vehicle-coordinates">
            <div className="vehicle-latitude">Latitude: {lat}</div>
            <div className="vehicle-longitude">Longitude: {long}</div>
          </div>
          <div>
            <button className="vehicle-details-btn" id={index}>
              Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default VehicleCard;
