import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import mjml from "mjml";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import mongoose, { set } from "mongoose";
import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Readable } from "stream";
import multerS3 from "multer-s3";
import { Timestamp } from "mongodb";
import imageUrlBuilder from "@sanity/image-url";


const app = express();
app.use(express.urlencoded({ extended: true }));





app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

app.use(cors({
  origin: ["http://localhost:3000", "https://www.pic-pursuit.com", "https://accounts.google.com", "https://google.com", "http://localhost:5173"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "OPTIONS"],
}));




dotenv.config();

// Connect to AWS

let s3Client = new S3Client({
  region: process.env.VITE_APP_S3_REGION,
  credentials: {
    accessKeyId: process.env.VITE_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_APP_S3_SECRET_ACCESS_KEY,
  },
});

// Connect to Sanity

const sanityClient = createClient({
  projectId: "kdt18ats",
  dataset: "production",
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: "2024-04-22", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.VITE_APP_SANITY_TOKEN_PROFILE_SUBMIT,
});

const builder = imageUrlBuilder(sanityClient);

/* Connect to MongoDB  */

const uri = `mongodb+srv://odevwork:${process.env.VITE_MONGO_DB_PASSWORD}@picpursuit.zkutaxi.mongodb.net/?retryWrites=true&w=majority&appName=PicPursuit`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    _id: String,
    password: String,
    email: String,
    name: String,
    credits: { type: Number, default: 0 },
    image: String,
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
  })
);
// order Schema

const orderSchema = new mongoose.Schema(
  {
    user: String,
    sessionId: String,
    items: [
      {
        name: String,
        url: String,
      },
    ],
    type: String,

    expirationTime: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

const googleClient = new OAuth2Client(
  "1073281504127-7qpg7ovf17f32hn04fe50oirkolpiq82.apps.googleusercontent.com"
);

const secretKey = process.env.VITE_STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey, { apiVersion: "2024-04-10" });

// regular login 

app.post("/login", express.json(), async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the database
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if the password is correct

  const validPassword =  bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate a token
  const token = jwt.sign(
    { email: user.email, _id: user._id, name: user.name },
    process.env.VITE_APP_JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token: token });
});








// google token verification

app.post("/google-signin", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_APP_GOOGLEO_CLIENT_ID, // use client ID, not client key
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    const email = payload["email"];
    const name = payload["name"];
    const image = payload["picture"];

    // Update the user in the database
    // Update the user in the database
    await User.findOneAndUpdate(
      { _id: userid },
      {
        $set: {
          email: email,
          name: name,
          image: image,
          emailVerified: true,
        },
      },
      { upsert: true }
    );
    console.log(`User ${name} updated in the database`);

    // Send the token and user data to the client
    res.json({ token });
  } catch (err) { console.error(err);
    res.status(500).send("Error processing Google sign-in");
  }
});

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  let user;

  try {
    // Decode the token without verifying to get the issuer claim
    const decodedToken = jwt.decode(token, { complete: true });

    if (
      decodedToken.payload.iss === "accounts.google.com" ||
      decodedToken.payload.iss === "https://accounts.google.com"
    ) {
      // This is a Google token, so verify it with Google's public key
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_APP_GOOGLEO_CLIENT_ID, // replace with your Google Client ID
      });
      const payload = ticket.getPayload();
      user = payload; // use the payload as the user info



    } else {
      // This is a local token, so verify it with your secret key
      user = jwt.verify(token, process.env.VITE_APP_JWT_SECRET_KEY); // replace with your secret
    }
    console.log("User Authenticated ✅");
    req.user = user;
    next();
  } catch (err) {
    console.log("Invalid token ❌");
    res.redirect(`${process.env.VITE_APP_URL}/signin`); // replace with the path to your sign-in page
  }
};

// multer setupconst

const storage = multer.memoryStorage();
const bioUpload = multer({ storage: storage });

// upload to AWS S3

const S3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.VITE_APP_S3_BUCKET,
    cacheControl: "no-store",
    acl: "private",
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        email: String(req.body.email),
        photographer: String(req.body.photographer), // convert to string
        price: String(req.body.price), // convert to string
        album: String(req.body.album), // convert to string
        categories: String(req.body.categories),
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 7 * 1024 * 1024 }, // limit file size to 6MB
  fileFilter: function (req, file, cb) {
    // reject 'arw' and 'raw' types
    if (file.mimetype === "image/arw" || file.mimetype === "image/raw") {
      return cb(new Error("ARW and RAW types are not supported"), false);
    }
    cb(null, true);
  },
});

app.post(
  "/uploadPhotos",
  authenticate,
  S3Upload.array("image", 25),
  (req, res, next) => {
    // Your existing logic here...

    console.log(req.files);
    console.log(req.body);

    // Send a response when done
    res.json({ message: "Upload successful" });
  },
  (error, req, res, next) => {
    // This is the error handling middleware
    // If there's an error during file upload, Multer will pass it here
    console.error(error);
    res.status(500).json({ error: error.message });
  }
);

// handle file upload

app.post("/create-checkout-session", express.json(), async (req, res) => {
  const { cart } = req.body;

  let line_items = [];

  try {
    if (typeof cart === "object" && cart !== null) {
      line_items = await Promise.all(
        Object.values(cart).map(async (item) => {
          const imageUrl = builder.image(item.image.asset).url();
          
          let product;
          let price;

          // search for products 

          product = await stripe.products.search({
            query: `name~"${item.name}"`, limit: 1,
          });

          if (product.data.length > 0) {
            console.log("existing product found");
            product = product.data[0];
            // If a product with the same name exists, use the existing product
            if (product.active){
              console.log("product is active")
            
              product = product
              }

            if (!product.active) {
              console.log("product is inactive, creating new product")
              
              product = await stripe.products.create({
                name: item.name,
                images: [imageUrl],
                metadata: {
                  photographer: item.photographer,
                  stripeConnectId: item.stripeConnectId,
             } });
            }



            price = await stripe.prices.search({
              query: `product:"${product.id}"`, limit: 1,
             
            }); 
            price = price.data[0];
            console.log(price);
            if (price) {
              console.log("existing price found");
            if (!price.active || price.unit_amount !== item.price * 100) {
              console.log("price is inactive or price has changed, creating new price")
              price = await stripe.prices.create({
                product: product.id,
                unit_amount: item.price * 100, // Stripe expects the amount in cents
                currency: "eur",
              });
            }}

            if (!price) {
              console.log("no price found, creating new price")
              console.log ("Product ID:", product.id)
              price = await stripe.prices.create({
                product: product.id,
                unit_amount: item.price * 100, // Stripe expects the amount in cents
                currency: "eur",
              });
            }


          } 
          
          
          else {
            // If no product with the same name exists, create a new product
            console.log("no product found, creating new product and price")
            product = await stripe.products.create({
              name: item.name,
              images: [imageUrl],
              metadata: {
                photographer: item.photographer,
                stripeConnectId: item.stripeConnectId,
              },
            });

            // Create a new price for the product
            price = await stripe.prices.create({
              product: product.id,
              unit_amount: item.price * 100, // Stripe expects the amount in cents
              currency: "eur",
            });
          }

          return {
            price: price.id,
            quantity: item.quantity,
          };
        })
      );
      console.log("Stripe product 🚀");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal", "eps", "giropay", "bancontact",],
      line_items: line_items,
      mode: "payment",
      success_url:
        `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/create-subscription", express.json(), async (req, res) => {
  // security, customers, need to login before they can subscribe

  console.log(req.body);

  const googleClient = new OAuth2Client(process.env.VITE_APP_GOOGLEO_CLIENT_ID);

  const { priceId } = req.body;

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  let user;

  try {
    // Decode the token without verifying to get the issuer claim
    const decodedToken = jwt.decode(token, { complete: true });

    if (
      decodedToken.payload.iss === "accounts.google.com" ||
      decodedToken.payload.iss === "https://accounts.google.com"
    ) {
      // This is a Google token, so verify it with Google's public key
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_APP_GOOGLEO_CLIENT_ID, // replace with your Google Client ID
      });
      const payload = ticket.getPayload();
      user = payload; // use the payload as the user info
    } else {
      // This is a local token, so verify it with your secret key
      user = jwt.verify(token, process.env.VITE_APP_JWT_SECRET_KEY); // replace with your secret
    }
  } catch (err) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Invalid token" });
  }

  //check for existing customer

  let customer;

  // Fetch customers with the given email
  const existingCustomers = await stripe.customers.list({
    email: user.email,
  });

  // Filter the customers by the additional metadata (e.g., Google account ID)
  const matchingCustomers = existingCustomers.data.filter(
    (customer) => customer.metadata.googleAccountId === user.googleAccountId
  );

  // If a customer with the given email and Google account ID exists, use the first one.
  // Otherwise, create a new customer.
  if (matchingCustomers.length > 0) {
    customer = matchingCustomers[0];
  } else {
    customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        googleAccountId: user.googleAccountId, // replace with actual Google account ID
      },
    });
  }

  // Create a new subscription
  // Create a new checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "ideal"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customer.id,
    mode: "subscription",
    success_url: `${process.env.VITE_APP_URL}/profile`,
    cancel_url: `${process.env.VITE_APP_URL}/pricing`,
  });

  // Send the session ID in the response
  res.json({ sessionId: session.id });
});



// ...

app.post("/signup", express.json(), async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // Check if the email already exists in the database
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    // If the email already exists, send an error response
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a verification token
  const verificationToken = jwt.sign({ email: email }, `${process.env.VITE_APP_JWT_SECRET_KEY}`, { expiresIn: '1h' });
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    credits: 0,
    _id: email,
    emailVerified: false,
    verificationToken: verificationToken
  });

  await user.save();
  console.log(`User ${user.email} created in the database`);

  // Send a verification email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // replace with your email provider
    auth: {
      user: "o.devwork@gmail.com",
      pass: `${process.env.VITE_APP_GMAIL_PASSWORD}`,
    }
  });

  const mailOptions = {
    from: 'o.picpursuit@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.VITE_APP_URL}/verify?token=${verificationToken}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error sending email' });
    } else {
      const token = jwt.sign(
        { email: user.email, _id: user._id, name: user.name },
        process.env.VITE_APP_JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({ message: "User created", token: token });
    }
  });
});


// verify email
app.get('/verify', express.json(), async (req, res) => {
  const data  = req.query;
  
  
  let token = data.token;


  let payload;
  try {
    payload = jwt.verify(token, `${process.env.VITE_APP_JWT_SECRET_KEY}`);
  } catch (e) {
    res.status(400).send('Invalid token');
    return;
  }
  console.log(payload)

  const email = payload.email;
  const user = await User.findOne({ email: email });


  if (user && user.verificationToken === token) {
    user.emailVerified = true;
    await user.save();
    console.log(`User ${user.email} verified`);

    // Redirect to the sign-in page
    res.json({ success: true, message: 'Email verified' });
    return;
  }

  res.status(400).send('Invalid token');
});


// forgot password 



app.post('/forgotPassword', express.json(), async (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Validate the email
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'No user found with this email.' });
  }

  // Generate a JWT token
  const resetToken = jwt.sign(
    { id: user._id, timestamp: new Date().getTime() },
    process.env.VITE_APP_JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Save the reset token to the user's account in the database
  user.resetPasswordToken = resetToken;
  await user.save();

  // Send an email to the user
  let resetUrl = `${process.env.VITE_APP_URL}/resetpassword?token=${resetToken}`;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail', // replace with your email provider
    auth: {
      user: "o.devwork@gmail.com",
      pass: `${process.env.VITE_APP_GMAIL_PASSWORD}`,
    }
  });

  let mailOptions = {
    from: "o.devwork@gmail.com",
    to: user.email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error sending email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Password reset link sent.' });
    }
  });
});


// reset password

app.post('/resetPassword', express.json(), async (req, res) => {
console.log(req.body)
  let token = req.body.token;
  let payload;
  let password = req.body.password;

  try {
    payload = jwt.verify(token, process.env.VITE_APP_JWT_SECRET_KEY);
  } catch (e) {
    res.status(400).send('Invalid token');
    return;
  }

  console.log(payload)
  let email = payload.id;

  const user = await User.findOne({
    email: email,
    resetPasswordToken: token,
   
  });

  if (!user) {
    console.log('no user found')
    res.status(400).send('Invalid token');
    return;
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password

  user.password = hashedPassword;
  user.resetPasswordToken = null;
  await user.save();
  console.log(`User ${user.email} password reset`)

  res.status(200).json({ message: 'Password reset' });
});
















// create user portal session

app.post("/create-portal-session", async (req, res) => {
  // Get the token from the Authorization header
  console.log(req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];

  const googleClient = new OAuth2Client(process.env.VITE_APP_GOOGLEO_CLIENT_ID);

  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  let user;
  let email;

  try {
    // Decode the token without verifying to get the issuer claim
    const decodedToken = jwt.decode(token, { complete: true });

    if (
      decodedToken.payload.iss === "accounts.google.com" ||
      decodedToken.payload.iss === "https://accounts.google.com"
    ) {
      // This is a Google token, so verify it with Google's public key
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_APP_GOOGLEO_CLIENT_ID, // replace with your Google Client ID
      });
      const payload = ticket.getPayload();
      user = payload; // use the payload as the user info
      email = user.email;
    } else {
      // This is a local token, so verify it with your secret key
      const payload = jwt.verify(token, process.env.VITE_APP_JWT_SECRET_KEY);

      // Get the user's email from the payload
      email = payload.email;
    }
  } catch (err) {
    console.log("Invalid token");
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const existingCustomers = await stripe.customers.list({
      email: email,
    });

    let customer;

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      console.log("Customer does not exist");
      res.status(404).send({ error: "Customer does not exist" });
      // Handle the case where the customer does not exist
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: "https://www.pic-pursuit.com/profile",
    });

    res.send({ url: session.url });
  } catch (err) {
    // Handle the case where the token is invalid or expired
    res.status(401).send({ error: "Invalid or expired token" });
    console.log(err);
  }
});


app.post('/sanitywebhook', express.json(), async (req, res) => {
  console.log(req.body);

  const { imageId } = req.body;
  const imageName = req.body.name;

  const params = {
    Bucket: process.env.VITE_APP_S3_BUCKET,
    Key: imageName,
  };

  const command = new DeleteObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    console.log(`file with ${imageName} was succesfully deleted`); // successful response
  } catch (err) {
    console.log(err, err.stack); // an error occurred
  }

  res.status(200).end();
});





const webHookSigningSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook received");
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        webHookSigningSecret
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed" ){
     const session = event.data.object;
      let sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ["line_items", "customer"],
        }
      );
      

      if (session.mode === "payment") {


      console.log("Checkout was successful, one time payment!");

      

      const cart = await Promise.all(
        sessionWithLineItems.line_items.data.map(async (item) => {
          const product = await stripe.products.retrieve(item.price.product);
          return {
            product,
            price: item.price,
          };
        })
      );
      console.log(cart);

      let photographerId = "";
      let purchasedProductName = "";
      let price = Number;
      let purchasedProductNames = [];
      let photographerIds = [];
      let prices = [];
      let productsPromises = [];

      for (let item of Object.values(cart)) {
        const stripeConnectId = item.product.metadata.stripeConnectId;
        price = item.price.unit_amount;
        photographerId = item.product.metadata.photographer;
        purchasedProductName = item.product.name;
        let command = new GetObjectCommand({
          Bucket: process.env.VITE_APP_S3_BUCKET,
          Key: purchasedProductName,
        });
        purchasedProductNames.push(purchasedProductName); // Add the product name to the array
        photographerIds.push(photographerId); // Add the photographer ID to the array
        prices.push(price); // Add the price to the array
        productsPromises.push({
          name: purchasedProductName,
          url: await getSignedUrl(s3Client, command, { expiresIn: 60 }),
        });

        const amountAfterFees = Math.round(price * 0.8) - 40; // Calculate a 20% fee
        console.log("Amount after fees:", amountAfterFees);
        console.log("stripeConnectId:", stripeConnectId);

        // make the transfer to the photographer
	 try {
          const transfer = await stripe.transfers.create({
              amount: amountAfterFees,
              currency: "eur",
              destination: stripeConnectId,
          });
      } catch (error) {
          console.error(`Failed to transfer funds to ${stripeConnectId}: ${error.message}`);
          // Continue with the next item
          continue;
      }
      
      }

      console.log(purchasedProductNames);

      // Retrieve the customer's email address from the session
      const customerEmail = session.customer_details.email;
      console.log(customerEmail);

      const customerName = session.customer_details.name;
      console.log(customerName);

      let products = await Promise.all(productsPromises);
      console.log(products);

      const expirationTime = new Date(Date.now() + 1000 * 20);

      // Create an order in the database
      const order = new Order({
        sessionId: session.id,
        user: customerEmail,
        items: products,
        expirationTime: expirationTime,
      });

      order
        .save()
        .then(() => {
          console.log("Order created in MongoDB");
          console.log("Checkout Successful");
        })
        .catch((error) => {
          console.error("Error creating order:", error);
        });

      res.status(200).json({ message: "Checkout successful" });
    }

// mode is Subscription or Recurring

    else if (session.mode === "subscription" || session.mode === "recurring") {
    
    for (let item of sessionWithLineItems.line_items.data) {
      if (
        item.price.type === "recurring" ||
        item.price.type === "subscription"
      ) {
        console.log("Subscription completed");
        console.log(sessionWithLineItems.line_items.data);

        // Retrieve the product associated with the line item
        const product = await stripe.products.retrieve(item.price.product);
        console.log(product.metadata); // Log the product metadata

        // Get the number of credits from the product metadata
        const credits = Number(product.metadata.downloads);
        console.log(credits);

        // Get the customer's email from the session
        const customerEmail = sessionWithLineItems.customer.email;
        console.log(customerEmail);

        // Find the user in your database and update their credits
        await User.findOneAndUpdate(
          { email: customerEmail },
          { $inc: { credits: Number(credits) } } // increment the user's credits by the purchased amount
        );

        console.log(`User ${customerEmail} received ${credits} credits`);

        return res.status(200).json({ received: true, Timestamp });
      }
    }
  }}
else{
  res.status(200).json({ received: true });
}

}
);

// get the product URLS from MongoDB

app.get("/products/:sessionId", async (req, res) => {
  // Get the order from the database using the session ID
  const order = await Order.findOne({ sessionId: req.params.sessionId });

  console.log(order);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Send the product URLs
  res.json(order);
});

// Update Sanity with the StripeConnect Id

app.post("/updateSanityStripeConnect", async (req, res) => {
  const event = req.body;

  if (event.type === "account.updated") {
    const stripeAccountId = event.data.object.id;
    const email = event.data.object.email;

    // Fetch the photographer document from Sanity based on the email
    const photographer = await sanityClient.fetch(
      `
      *[_type == "Photographer" && email == $email][0]
    `,
      { email }
    );

    if (photographer) {
      // Update the photographer document with the Stripe Connect ID
      await sanityClient
        .patch(photographer._id)
        .set({ stripeConnectId: stripeAccountId })
        .commit();
    }
  }

  console.log("Sanity updated with Stripe Connect ID");

  res.sendStatus(200);
});

// Show user account and credits in profile

app.get("/account", authenticate, async (req, res) => {
  const signedInUser = req.user;
  const email = signedInUser.email;
  console.log(email);
  let url = "";

  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const orders = await Order.find({
      user: email,
      createdAt: { $gte: oneMonthAgo },
    })
      .select("items.url items.expirationTime items.name")
      .sort({ createdAt: -1 })
      .limit(20);

    const result = orders.map((order) => {
      return {
        expirationTime: order.expirationTime,
        items: order.items.map((item) => {
          return {
            url: url,
            name: item.name,
          };
        }),
      };
    });

    // find user in database
    const user = await User.findOne({ email });

    // merge user and result into a single object
    const response = {
      user: {
        name: user.name,
        email: user.email,
        credits: user.credits,
      },
      orders: result,
    };
    console.log("data updated");

    res.json(response);
  } catch (err) {
    console.log(err);
    res.redirect(`${process.env.VITE_APP_URL}/signin`); // replace with the path to your sign-in page
  }
});

// Checkout with Pic Credits

app.post("/checkout-with-credits", authenticate, express.json(), async (req, res) => {
  
  const cart = req.body.cartDetails;
  let user = req.user;
  let email = user.email;
  console.log(cart);
  const sessionId = req.body.sessionId;
  
  
  let quantity = 0;
  let stripeConnectId = "";
  let photographerId = "";
  let purchasedProductName = "";
  let price = Number;
  let purchasedProductNames = [];
  let photographerIds = [];
  let prices = [];
  let productsPromises = [];

  for (let item of Object.values(cart)) {
    stripeConnectId = item.stripeConnectId;
    price = item.price;
    photographerId = item.photographer;
    purchasedProductName = item.name;
    let command = new GetObjectCommand({
      Bucket: process.env.VITE_APP_S3_BUCKET,
      Key: purchasedProductName,
    });
    purchasedProductNames.push(purchasedProductName); // Add the product name to the array
    photographerIds.push(photographerId); // Add the photographer ID to the array
    prices.push(price); // Add the price to the array
    productsPromises.push({
      name: purchasedProductName,
      url: await getSignedUrl(s3Client, command, { expiresIn: 30 }),
    });

   

    // make the transfer to the photographer

     try {
          const transfer = await stripe.transfers.create({
              amount: 100,
              currency: "eur",
              destination: stripeConnectId,
          });
console.log("Transfer to photographer successfull 💸");
      } catch (error) {
          console.error(`Failed to transfer funds to ${stripeConnectId}: ${error.message}`);
          // Continue with the next item
          continue;
      }

    
    
  }

    console.log(purchasedProductNames);

  // Retrieve the customer's email address from the session
  quantity = purchasedProductNames.length;

  await User.findOneAndUpdate(
    { email: email },
    { $inc: { credits: -Number(quantity) } })
  
let products = await Promise.all(productsPromises);


  // Create an order in the database
  const order = new Order({
    user: email,
    items: products,
    type: "credits",
    sessionId: sessionId,
  });

  order
    .save()
    .then(() => {
      console.log("Order created in MongoDB");
      console.log("Checkout with Credits Successful");
    })
    .catch((error) => {
      console.error("Error creating order:", error);
    });

  res.status(200).json({ message: "Checkout successful" });
});
  
    


      

     

   

// Upload Bio to Sanity ************************************************

app.post("/uploadBio", bioUpload.single("bioImage"), async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  let email, name, slug;

  // Verify the token
  try {
    // Decode the token without verifying to get the issuer claim
    const decodedToken = jwt.decode(token, { complete: true });

    if (
      decodedToken.payload.iss === "accounts.google.com" ||
      decodedToken.payload.iss === "https://accounts.google.com"
    ) {
      // This is a Google token, so verify it with Google's public key
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.VITE_APP_GOOGLEO_CLIENT_ID, // replace with your Google Client ID
      });
      const payload = ticket.getPayload();
      // use the payload as the user info
      email = payload.email;
      // find user in database
      name = payload.name;

      function nameToSlug(name) {
        return {
          current: name.toLowerCase().replace(/ /g, "-"),
        };
      }

      slug = nameToSlug(name);
    } else {
      // This is a local token, so verify it with your secret key
      const payload = jwt.verify(token, process.env.VITE_APP_JWT_SECRET_KEY);

      console.log(payload);

      // Get the user's email from the payload
      email = payload.email;

      name = payload.name;

      function nameToSlug(name) {
        return {
          current: name.toLowerCase().replace(/ /g, "-"),
        };
      }

      slug = nameToSlug(name);
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token" });
  }

  // Upload the data to Sanity

  const existingPhotographer = await sanityClient.fetch(
    '*[_type == "Photographer" && name == $name && email == $email][0]',
    { name: name, email: email }
  );

  // Check if a photographer was found
  if (existingPhotographer) {
    console.log("A Profile with this name and email has already been uploaded");

    // ...

    // Get the document ID
    const documentId = existingPhotographer._id;

    const { IG, bio, payment } = req.body;

    const categoriesObject = JSON.parse(req.body.categories);

    const selectedCategoryNames = Object.entries(categoriesObject)
      .filter(([category, isSelected]) => isSelected)
      .map(([category, isSelected]) => category);

    let uploadedImage;
    if (req.file) {
      const imageAsset = req.file.buffer;

      const readableStream = new Readable();
      readableStream.push(imageAsset);
      readableStream.push(null);

      // Upload the image to Sanity.io
      uploadedImage = await sanityClient.assets.upload("image", readableStream);
    }

    // Update the document

    // Fetch the IDs of the selected categories from Sanity
    const selectedCategoryIds = await Promise.all(
      selectedCategoryNames.map(async (categoryName) => {
        const query = `*[_type == "Categories" && CategoryName == $name][0]._id`;
        const params = { name: categoryName };
        const result = await sanityClient.fetch(query, params);

        console.log(`Fetch result for category "${categoryName}":`, result);

        // Check if result is a string
        if (typeof result !== "string") {
          throw new Error(
            `Fetch call for category "${categoryName}" did not return a string`
          );
        }

        return result;
      })
    );

    const selectedCategories = selectedCategoryIds.map((id) => ({
      _key: uuidv4(),
      _ref: id,
      _type: "reference",
    }));

    // Use patch to update the document
    let patch = sanityClient.patch(documentId);

    if (req.file) {
      patch = patch.set({
        bioImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedImage._id,
          },
        },
      });
    }

    if (selectedCategories && selectedCategories.length > 0) {
      patch = patch.set({ interestedCategories: selectedCategories });
    }

    if (bio) {
      patch = patch.set({ bio: bio });
    }

    if (payment) {
      patch = patch.set({ payment: payment });
    }

    if (IG) {
      patch = patch.set({ IG: IG });
    }

    if (slug) {
      patch = patch.set({ slug: slug });
    }

    const result = await patch.commit();

    res.send({ message: "Profile Updated" });

    console.log(result);

    return;
  }

  // New User Profile **********************************************

  const { IG, bio, payment } = req.body;

  const categoriesObject = JSON.parse(req.body.categories);

  const selectedCategoryNames = Object.entries(categoriesObject)
    .filter(([category, isSelected]) => isSelected)
    .map(([category, isSelected]) => category);

  let uploadedImage;
  if (req.file) {
    const imageAsset = req.file.buffer;

    const readableStream = new Readable();
    readableStream.push(imageAsset);
    readableStream.push(null);

    // Upload the image to Sanity.io
    uploadedImage = await sanityClient.assets.upload("image", readableStream);
  }

  // Fetch the IDs of the selected categories from Sanity
  const selectedCategoryIds = await Promise.all(
    selectedCategoryNames.map(async (categoryName) => {
      const query = `*[_type == "Categories" && CategoryName == $name][0]._id`;
      const params = { name: categoryName };
      const result = await sanityClient.fetch(query, params);

      console.log(`Fetch result for category "${categoryName}":`, result);

      // Check if result is a string
      if (typeof result !== "string") {
        throw new Error(
          `Fetch call for category "${categoryName}" did not return a string`
        );
      }

      return result;
    })
  );

  const selectedCategories = selectedCategoryIds.map((id) => ({
    _key: uuidv4(),
    _ref: id,
    _type: "reference",
  }));

  // Document

  const document = {
    _type: "Photographer",
    name: name,
    bioImage: uploadedImage
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedImage._id,
          },
        }
      : {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: "image-dddf07396a1019250648189d5a80e704459aa65f-600x576-png",
          },
        }, // or some default value
    interestedCategories: selectedCategories,
    bio: bio,
    email: email,
    payment: payment,
    IG: IG,
    slug: slug,
  };
  // ...

  const result = await sanityClient.create(document);
  console.log(result);
  res.send({ message: "New Profile Created" });
});

// Let Photographers Create a stripe account and sell their photos

app.post("/sell", authenticate, express.json(), async (req, res) => {
  const user = req.user;
  console.log(user);

  const account = await stripe.accounts.create({
    type: "standard",
  });

  // Update the user in Sanity with the Stripe Account ID

  const name = req.user.name;
  const email = req.user.email;
  const stripeAccountId = account.id;

  const existingPhotographer = await sanityClient.fetch(
    '*[_type == "Photographer" && name == $name && email == $email][0]',
    { name: name, email: email }
  );

  // Check if a photographer was found
  if (existingPhotographer) {
    console.log("A Profile with this name and email has already been uploaded");

    // Patch the existing photographer document with the new stripeConnectId
    await sanityClient
      .patch(existingPhotographer._id) // Replace with the actual ID of the document
      .set({ stripeConnectId: stripeAccountId })
      .commit();
  } else {
    // Create a new photographer document
    await sanityClient.create({
      _type: "Photographer",
      name: name,
      email: email,
      stripeConnectId: stripeAccountId,
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.VITE_APP_URL}/profile`,
    return_url: `${process.env.VITE_APP_URL}/profile`,
    type: "account_onboarding",
  });

  const url = accountLink.url;
  console.log(url);
  // return the account link to the client
  res.json({ url });
});

// Onboarding status for Stripe

app.post(
  "/onboarding-status",
  authenticate,
  express.json(),
  async (req, res) => {
    console.log(req.body);

    // The connected account ID
    const accountId = req.body.stripeConnectId;
    console.log(accountId); // Log the accountId

    try {
      const account = await stripe.accounts.retrieve(accountId);
      const { requirements } = account;

      // Check if the requirements object exists
      if (!requirements) {
        return res
          .status(500)
          .json({ error: "Requirements object is undefined" });
      }

      // If the `current_deadline` field is null, the user has completed the onboarding process
      const completedOnboarding = requirements.current_deadline === null;

      res.json({ completedOnboarding });
      console.log("Onboarding status sent to the client");
    } catch (err) {
      console.error(err); // Log the entire error object
      res.status(500).json({ error: err.message, type: err.type }); // Send back the error type
    }
  }
);

// Delete Album
app.post("/deleteAlbum", authenticate, express.json(), async (req, res) => {
  const albumId = req.body.albumId;

  const query = `*[_type in ["Album"] && _id == "${albumId}"] {
    
  "photoRefs": photos[] {_ref},
  "photoNames": photos[]->{name}
  }`;

  const album = (await sanityClient.fetch(query))[0];
  console.log(album);

  if (!album || album.length === 0) {
    return res.status(404).send({ error: "No photos in this Album" });
  }

  const photoRefs = album.photoRefs;

  const photoNames = album.photoNames;
  console.log(photoNames);

  let patch = sanityClient.patch(albumId).set({ photos: [] });
  await patch.commit();

  // Delete the photos and Album
  const deleteTransaction = sanityClient.transaction();

  photoRefs.forEach(({ _ref }) => {
    deleteTransaction.delete(_ref);
  });

  deleteTransaction.delete(albumId);

  await deleteTransaction.commit();

  // Delete the photos and the cover image from the S3 bucket
  const deleteParams = {
    Bucket: process.env.VITE_APP_S3_BUCKET,
    Delete: {
      Objects: photoNames.map((photo) => ({ Key: photo.name })),
    },
  };

  try {
    const data = await s3Client.send(new DeleteObjectsCommand(deleteParams));
    console.log(data);

    if (data.Errors && data.Errors.length > 0) {
      console.log("Failed to delete some photos:", data.Errors);
    }

    return res
      .status(200)
      .send({ message: "Album and photos deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Failed to delete photos from S3" });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000 🚀`);
});


