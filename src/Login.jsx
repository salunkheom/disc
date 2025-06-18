export default function Login() {
  return (
    <div className="login ">
      <h2>sign in</h2>
      <p>stay updated on your professional world</p>
      <form id="form">
        <input type="text" placeholder="Email" name="" id="email" />
        <input type="text" placeholder="Password" name="" id="password" />
        <p>forgot password ? </p>
        <button id="sign-in" className="btn-f btn-1">
          sign in
        </button>
        <p>
          {" "}
          <span id="all">New to Linkdin ? </span> Join now
        </p>
      </form>
    </div>
  );
}
