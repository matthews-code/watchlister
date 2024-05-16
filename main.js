import "./style.css";
import { Clerk } from "@clerk/clerk-js";
import { dark } from "@clerk/themes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerk = new Clerk(clerkPubKey);

await clerk.load({
  appearance: {
    baseTheme: dark,
  },
});

if (clerk.user) {
  document.getElementById("app").innerHTML = `
    <div id="user-button"></div>
  `;

  const userButtonDiv = document.getElementById("user-button");

  clerk.mountUserButton(userButtonDiv);
} else {
  document.getElementById("auth-div").innerHTML = `
    <div id="sign-in"></div>
  `;

  const signInDiv = document.getElementById("sign-in");

  clerk.mountSignIn(signInDiv);
}
