import myImage from "/user1.jpg";

export default function Prof() {
  return (
    <div className="main-p">
      <h1>Profile</h1>
      <img src={myImage} alt="" />
      <p>Role :</p>
      <p>Email id :</p>
    </div>
  );
}
