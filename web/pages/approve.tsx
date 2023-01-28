import Cookies from "js-cookie";

export default function Approve() {
  return (
    <button
      onClick={() =>
        (window.location.href = `http://localhost:8080?token=${Cookies.get(
          "__session"
        )}`)
      }
    >
      Approve
    </button>
  );
}
