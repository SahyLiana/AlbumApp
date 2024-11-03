import Home from "../components/Home";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="flex">
      <Navbar />
      <Home />
    </div>
  );
}

export default Dashboard;
