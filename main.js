import "./style.css";
import { Clerk } from "@clerk/clerk-js";
import { dark } from "@clerk/themes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const clerk = new Clerk(clerkPubKey);

const authDiv = document.getElementById("auth-div");

await clerk.load({
  // appearance: {
  //   baseTheme: dark,
  // },
  appearance: {
    elements: {},
  },
});

if (clerk.user) {
  console.log("hello");
  if (authDiv) authDiv.style.display = "none";

  document.getElementById("user-button-div").innerHTML = `
    <div id="user-button"></div>
  `;

  const userButtonDiv = document.getElementById("user-button");

  clerk.mountUserButton(userButtonDiv);
} else {
  authDiv.innerHTML = `
    <div id="sign-in"></div>
  `;

  const signInDiv = document.getElementById("sign-in");

  clerk.mountSignIn(signInDiv);
}
