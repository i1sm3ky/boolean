import VehicleCard from "./VehicleCard";

import "./App.css";

function App() {
  var isRegisterShown = true;

  const handleRegister = () => {
    if (isRegisterShown == true) {
      document.querySelector(".register-div").classList.add("hide");
      isRegisterShown = false;
    } else {
      document.querySelector(".register-div").classList.remove("hide");
      isRegisterShown = true;
    }
  };

  const contractSource = `
    @compiler >= 4

    contract VehicleTracking =
    
      record vehicle = 
        { vehicleName : string,
          vehicleNum  : string,
          latitude    : int,
          longitude   : int,
          vehicleImg  : string,
          driverImg   : string,
          driverName  : string,
          driverNum   : int }
    
      record state = 
        { vehicles : map(int, vehicle),
          vehicleCount : int }
    
      entrypoint init() = 
        { vehicles = {},
          vehicleCount = 0 }
    
      entrypoint getVehicleCount() : int =
        state.vehicleCount
    
      stateful entrypoint registerVehicle(vname : string, vnum : string, vimg : string, dimg : string, dname : string, dnum : int) =
        let vehicle = { vehicleName = vname, vehicleNum = vnum, latitude = 0, longitude = 0, vehicleImg = vimg, driverImg = dimg, driverName = dname, driverNum = dnum }
        let index = getVehicleCount() + 1
        put(state { vehicles[index] = vehicle, vehicleCount = index })
    
      entrypoint getLocation(index : int) : vehicle =
        switch(Map.lookup(index, state.vehicles))
          None    => abort("There are no registered vehicle.")
          Some(x) => x
    
      stateful entrypoint updateLocation(index : int, lat : int, long : int) =
        let vehicle = getLocation(index)
        let updatedVehicles = state.vehicles{ [index].latitude = lat }
        put(state{ vehicles = updatedVehicles})
        let updatedVehicles = state.vehicles{ [index].longitude = long }
        put(state{ vehicles = updatedVehicles})`;
  const contractAddress = "ct_2oX9Kst1vCJntyCbLHqtDnfPUKjAFqV7spBd9tNangeBhaqo62";
  var client = null;
  var vehicleCount = 0;

  async function callStatic(func, args) {
    const contract = await client.getContractInstance(contractSource, { contractAddress });
    const calledGet = await contract.call(func, args, { callStatic: true }).catch((e) => console.error(e));
    const decodedGet = await calledGet.decode().catch((e) => console.error(e));

    return decodedGet;
  }

  async function contractCall(func, args) {
    const contract = await client.getContractInstance(contractSource, { contractAddress });
    const calledSet = await contract.call(func, args, { amount: 0 }).catch((e) => console.error(e));

    return calledSet;
  }

  window.addEventListener("load", async () => {
    client = await Ae.Aepp();

    vehicleCount = await callStatic("getVehicleCount", []);

    for (let i = 1; i <= vehicleCount; i++) {
      const vehicle = await callStatic("getVehicle", [i]);

      document.querySelector("vehicle-container").appendChild(<VehicleCard index={i} vehicleName={vehicle.vehicleName} vehicleNum={vehicle.vehicleNum} vehicleImg={vehicle.vehicleImg} driverImg={vehicle.driverImg} driverName={vehicle.driverName} driverNum={vehicle.driverNum} lat={vehicle.lat} lomg={vehicle.long} />);
    }
  });

  jQuery(".register-div").on("click", ".vehicle-register-btn"),
    async function (event) {
      const vehicleName = $(".vehicle-name-input").val();
      const vehicleNum = $(".vehicle-num-input").val();
      const vehicleImg = $(".vehicle-img-input").val();
      const driverImg = $(".driver-img-input").val();
      const driverName = $(".driver-name-input").val();
      const driverNum = $(".driver-num-input").val();

      await contractCall("registerVehicle", [vehicleName, vehicleNum, vehicleImg, driverImg, driverName, driverNum]);
    };

  return (
    <>
      <button onClick={handleRegister}>Register a vehicle</button>
      <div className="register-div">
        <input type="text" className="vehicle-name-input" />
        <input type="text" className="vehicle-num-input" />
        <input type="text" className="vehicle-img-input" />
        <input type="text" className="driver-img-input" />
        <input type="text" className="driver-name-input" />
        <input type="text" className="driver-num-input" />
        <button className="vehicle-register-btn">Register</button>
      </div>
      <div className="vehicle-container"></div>
    </>
  );
}

export default App;
