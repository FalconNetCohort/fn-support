// //firebase functions v2 inti
// import { onRequest } from "firebase-functions/v2/https";
// import { initializeApp } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";

// initializeApp();

// export const addAdminRole = onRequest({ cors: true }, async (req, res) => {
//   const authorizationHeader = req.headers.authorization;
//   if (!authorizationHeader) {
//     res.status(400).send("You must log in to continue");
//     return;
//   }
//   const idToken = authorizationHeader.split("Bearer ")[1];

//   await getAuth()
//     .verifyIdToken(idToken)
//     .catch((error) => {
//       res.status(500).send({ data: error.message });
//     });

//   const { email } = req.body.data;
//   const user = await getAuth().getUserByEmail(email);
//   console.log(email);

//   if (!user) {
//     res.status(500).send({ data: "User not found" });
//   }

//   await getAuth()
//     .setCustomUserClaims(user.uid, { admin: true })
//     .then(() => {
//       res.status(200).send({ data: "Admin added successfully" });
//     })
//     .catch((error) => {
//       res.status(500).send({ data: error.message });
//     });
// });

// export const removeAdminRole = onRequest({ cors: true }, async (req, res) => {
//   const authorizationHeader = req.headers.authorization;
//   if (!authorizationHeader) {
//     res.status(400).send("You must log in to continue");
//     return;
//   }
//   const idToken = authorizationHeader.split("Bearer ")[1];

//   await getAuth()
//     .verifyIdToken(idToken)
//     .catch((error) => {
//       res.status(500).send({ data: error.message });
//     });

//   const { email } = req.body.data;
//   const user = await getAuth().getUserByEmail(email);
//   console.log(email);

//   if (!user) {
//     res.status(500).send({ data: "User not found" });
//   }

//   await getAuth()
//     .setCustomUserClaims(user.uid, { admin: false })
//     .then(() => {
//       res.status(200).send({ data: "Admin removed successfully" });
//     })
//     .catch((error) => {
//       res.status(500).send({ data: error.message });
//     });
// });

// export const listUsers = onRequest({ cors: true }, async (req, res) => {
//   const authorizationHeader = req.headers.authorization;
//   if (!authorizationHeader) {
//     res.status(400).send("You must log in to continue");
//     return;
//   }
//   const idToken = authorizationHeader.split("Bearer ")[1];

//   await getAuth()
//     .verifyIdToken(idToken)
//     .catch((error) => {
//       res.status(500).send({ data: error.message });
//     });

//   const listUsers = await getAuth().listUsers();
//   const users = listUsers.users.map((user) => {
//     return {
//       email: user.email,
//       emailVerified: user.emailVerified,
//       admin: user.customClaims?.admin || false,
//     };
//   });

//   res.status(200).send({ data: users });
// });
