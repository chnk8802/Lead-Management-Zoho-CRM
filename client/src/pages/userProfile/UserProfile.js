import { LogoutButton } from "../../components/LogoutButton.js";
import "./UserProfile.css";

function UserProfile({ userDetails }) {
  const handleClick = () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    window.location.href = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${clientId}&scope=ZohoCRM.modules.all&redirect_uri=${redirectUri}/oauthredirect&access_type=offline&prompt=consent`;
  };
  return (
    <div className="card">
      <br></br>
      <h1 className="title">User Profile Management</h1>
      <img
        id="userimg"
        width="200px"
        height="450px"
        src="https://cdn2.iconfinder.com/data/icons/user-management/512/profile_settings-512.png"
      />
      <p className="title" id="fname">
        {"User ID : " + userDetails.userId}
      </p>
      <p className="title" id="fname">
        {"First Name : " + userDetails.firstName}
      </p>
      <p className="title" id="lname">
        {"Last Name: " + userDetails.lastName}
      </p>
      <p className="title" id="mailid">
        {"Email Address: " + userDetails.mailid}
      </p>
      <p className="title" id="tzone">
        {"Time Zone: " + userDetails.timeZone}
      </p>
      <p className="title" id="ctime">
        {"Joined On: " + userDetails.createdTime}
      </p>
      <button onClick={handleClick}>Connect to Zoho</button>
      <LogoutButton btnvalue={{ title: "Logout" }}></LogoutButton>
    </div>
  );
}
export default UserProfile;
