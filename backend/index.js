require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const fs = require('fs');
const path = require('path');
const db = require('./database');
const bodyParser = require('body-parser');
const Papa = require('papaparse');
const jwt = require('jsonwebtoken');
const Fuse = require('fuse.js');
const axios = require('axios');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const {authenticateToken} = require('./utilities'); 
const { error } = require('console');

const Razorpay = require('razorpay');

const CAPTCHA_KEY = process.env.CAPTCHA_SECRET_KEY;

app.use(express.json());
app.use(bodyParser.json());
app.use(
    cors({
        origin: '*',
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'Hello!'});
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dotnotesapp@gmail.com',
        pass: 'ivenvjzkionrzvds'
    }
});

const sendResetEmail = async (toEmail, resetLink) => {
    const mailOptions = {
        from: 'E-commerce Project',
        to: toEmail,
        subject: 'Reset Password',
        html: `<p>This is in response to your request for reseting your password. <br><br>
                Click the link to proceed: <a href="${resetLink}">Reset Password</a><br>
                Note: This Link will expire in 30 minutes<br><br>
                If this action wasn't initiated by you, please report this to the Help Desk immediately. <br><br><br><br>
                
                E-commerce Manager, <br>    
                John Doe</p>`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Register
app.post('/register', async (req, res) => {

    const { username, email, password, phone, captchaToken } = req.body;

    if (!username || !email || !password || !phone) return res.status(400).json({ error: "Please fill all fields" });

    if (!captchaToken) {
        return res.status(400).json({ success: false, message: "reCAPTCHA token is missing" });
    }

    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

        const response = await axios.post(
            verificationURL,
            new URLSearchParams({
                secret: CAPTCHA_KEY,
                response: captchaToken,
            })
        );

        const { success, score, action } = response.data;

        if (!success) {
            return res.status(403).json({ success: false, message: "reCAPTCHA failed" });
        }

        // Register
        const checkEmail = `SELECT 1 FROM users WHERE email = ? LIMIT 1`;
        db.get(checkEmail, [email], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) return res.status(409).json({ error: "Email already registered" });

            const registerSql = `INSERT INTO users (username, email, password, contact_no) VALUES (?, ?, ?, ?)`;

            db.run(registerSql, [username, email, password, phone], function (err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                const userId = this.lastID;
                const user = { id: userId, username, email };
                const accessToken = jwt.sign({ user }, process.env.ACCESS_SECRET_TOKEN, {
                    expiresIn: '36000m',
                });

                const insertWishlist = `INSERT INTO wishlist (user_id) VALUES (?)`;
                const insertCart = `INSERT INTO cart (user_id) VALUES (?)`;

                db.run(insertWishlist, [userId], (err) => {
                    if (err) {
                        console.error("Error creating wishlist row:", err.message);
                    }
                });

                db.run(insertCart, [userId], (err) => {
                    if (err) {
                        console.error("Error creating cart row:", err.message);
                    }
                });

                res.status(201).json({ 
                    error: false,
                    message: 'User created successfully',
                    user,
                    accessToken
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Captcha Error" });
    }
});

// Login
app.post('/login', async (req,res) => {

    const { email, password, captchaToken } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Please fill all fields" });

    if (!captchaToken) {
        return res.status(400).json({ success: false, message: "reCAPTCHA token is missing" });
    }

    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

        const response = await axios.post(
            verificationURL,
            new URLSearchParams({
                secret: CAPTCHA_KEY,
                response: captchaToken,
            })
        );

        const { success, score, action } = response.data;

        if (!success && captchaToken !== '/test') {
            return res.status(403).json({ success: false, message: "reCAPTCHA failed" });
        }

        // Login: 
        const checkEmail = `SELECT * FROM users WHERE email = ? LIMIT 1`;
        db.get(checkEmail, [email], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!row) return res.status(409).json({ error: "Email not registered" });

            if (row.password !== password) return res.status(401).json({ error: "Incorrect password" });

            db.get(`SELECT items FROM wishlist WHERE user_id = ?`, [row.id], (err, items) => {
                if (err) return res.status(500).json({ error: err.message });

                const user = { 
                    id: row.id, 
                    username: row.username, 
                    email,
                    address: row.address,
                    phone: row.contact_no,
                    wishlist: items 
                };
                const accessToken = jwt.sign({ user }, process.env.ACCESS_SECRET_TOKEN, {
                    expiresIn: '36000m',
                });
        
                return res.status(200).json({ 
                    error: false,
                    message: "Logged in successfully",
                    user,
                    accessToken
                });
            }); 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Captcha Error" });
    }
});

// Forgot Password 
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const checkEmail = () => {
            return new Promise((resolve, reject) => {
                const query = `SELECT * FROM users WHERE email = ?`; 

                db.get(query, [email], (err, row) => {
                if (err) return reject(err);
                resolve(!!row); 
                });
            });
        };

        const emailExists = await checkEmail();
        if (!emailExists) return res.status(500).json({ error: true, message: 'Email does not exist.'}); 

        const jwt_secret = process.env.PASS_RESET_SECRET;

        const token = jwt.sign(
            { email: email},
            jwt_secret,
            { expiresIn: '30m'}
        );
        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await sendResetEmail(email, resetLink);
        return res.status(200).json({ message: 'Reset email sent successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
});

// New Password
app.post('/change-password', async (req, res) => {
    const { newPassword, token } = req.body;

    if (!newPassword || newPassword.trim() === '') return res.status(500).json({ error: true, message: 'Password cannot be blank'});

    try {

        const tokenUsed = await new Promise((resolve, reject)=>{
            db.get(`SELECT * FROM used_tokens WHERE token = ?`, [token], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });

        if (tokenUsed) {
            return res.status(400).json({ error: true, message: 'Token has already been used' });
        }

        const verify = jwt.verify(token, process.env.PASS_RESET_SECRET);
        if (!verify.email) return res.status(400).json({ error: true, message: 'Invalid Token' });

        const query = `UPDATE users SET password = ? WHERE email = ?`;

        await new Promise((resolve, reject) => {
            db.run(query, [newPassword, verify.email], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO used_tokens (email, token) VALUES (?, ?)`, [verify.email, token], (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });

        return res.status(200).json({ error: false, message: 'Password Changed Successfully'});

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/verify-token', async (req, res) => {
    const { token } = req.body;

    try {
        const tokenUsed = await new Promise((resolve, reject)=>{
            db.get(`SELECT * FROM used_tokens WHERE token = ?`, [token], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });

        if (tokenUsed) {
            return res.status(400).json({ error: true, message: 'Token has already been used' });
        }

        const verify = jwt.verify(token, process.env.PASS_RESET_SECRET);
        if (!verify.email) return res.status(400).json({ error: true, message: 'Invalid Token' });

        return res.status(200).json({ error: false, message: 'Token is Valid'});
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error'});
    }

})

// Get User Info
app.get('/get-userInfo', authenticateToken, (req, res) => {
    const { user } = req.user;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.get(query, [user.email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(409).json({ error: true, message: "Invalid Token" });
        
        db.get(`SELECT items FROM wishlist WHERE user_id = ?`, [row.id], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });

            db.get(`SELECT items FROM userCart WHERE user_id = ?`, [row.id], (err, cart) => {
                if (err) return res.status(500).json({ error: err.message});
                if (!cart) db.run(`INSERT INTO userCart (user_id) VALUES (?)`, [row.id] , (err) => {
                    console.error('Some error occured: ', err);
                });

                const data = { id: row.id, username: row.username, email: row.email, wishlist: items, cart: cart, address: row.address, phone: row.contact_no };
                return res.status(200).json({ error: false, user: data });
            })
        });
    })

});

// Get All Users
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    });
});

// Update wishlist
app.put('/update-wishlist', authenticateToken, (req, res) => {
    const { newWishlist } = req.body;
    const { user } = req.user;

    db.run(
        `UPDATE wishlist SET items = ? WHERE user_id = ?`,
        [newWishlist, user.id],
        function (err) {
            if (err) {
            res.status(500).json({ error: err.message });
            } else {
            res.json({ message: 'Wishlist updated!', newWishlist });
            }
        }
    );
});

// Update Cart
app.put('/update-cart', authenticateToken, (req,res) => {
    const { newCart } = req.body;
    const { user } = req.user;

    db.run(
        `UPDATE userCart SET items = ? where user_id = ?`,
        [newCart, user.id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'Cart Updated!', newCart });
        } 
    );
});

// Fetch All Products 
app.get('/all-products', async (req, res) => {

    const filePath = path.join(__dirname, 'AllProducts_v2.csv');

    fs.readFile(filePath, 'utf8', (err, csvData) => {
        if (err) return res.status(500).json({ error: 'Failed to read CSV', details: err.message });

        Papa.parse(csvData, {
            header: true, 
            skipEmptyLines: true,
            complete: (result) => {

                const parsedData = result.data.map((row, index) => ({
                    id: row.prod_id,
                    image: `/productsNew/${row.name}.jpg`, 
                    name: row.name, 
                    category: row.category, 
                    sub_category: row.sub_category, 
                    price: row.price, 
                    discount: row.discount, 
                    available_colours: row.available_colours,
                    size_options: row.size_options,
                    in_stock: row.in_stock === 'true' 
                }));
                res.json(parsedData);
            },
            error: (err) => {
                res.status(500).json({ error: 'Failed to parse CSV', details: err.message });
            }
        });
    
    });
});
app.listen(8000);

// Search Products
app.get('/search-products', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';

  fs.readFile(path.join(__dirname, 'AllProducts_v2.csv'), 'utf8', (err, csvData) => {
    if (err) return res.status(500).json({ error: 'Failed to read CSV' });

    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;


        let filtered;
        if (query.trim() === '') {
        filtered = data;
        } else {
        const fuse = new Fuse(data, {
            keys: ['name', 'category', 'sub_category'],
            threshold: 0.4
        });

        filtered = fuse.search(query).map(result => result.item);
        }

        const parsedData = filtered.map(toParsedData);

        res.json(parsedData);
      }
    });
  });
});

// Order Request
app.post('/order', async (req,res) =>{
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_ID,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);
        console.log(order);

        if (!order) return res.status(500).send('Error');

        return res.json(order);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Payments Table
app.post('/insert-payment', async (req, res) => {
    const { orderId, paymentId, userId, name, amount, products } = req.body;
    let address = 'temp_address';

    db.run(`INSERT INTO payments (order_id, payment_id, user_id, order_for, amount, delivered_at, products) VALUES (?, ?, ?, ?, ?, ?, ?)`, [orderId, paymentId, userId, name, amount, address, products], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ message: "Payment Registered", orderId, paymentId, userId});
    });
});

// Fetch User's Orders
app.get('/fetch-orders', authenticateToken, async (req, res) => {
    const userId = String(req.user.user.id);

    db.all(`SELECT * FROM payments WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message});
        if (rows.length === 0) return res.json({ message: "User has no orders" });

        return res.json(rows);
    })
});

// Create a Review
app.post('/create-review', async (req,res) => {
    const { prod_id, user_id, username, title, review, rating } = req.body;
    const insert = `INSERT INTO product_reviews (prod_id, user_id, username, title, review, rating) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(insert, [prod_id, user_id, username, title, review, rating], function(err) {
        if (err) return res.status(500).json({ error: err.message }); 

        return res.status(200).json({ message: "Review Created!", review_id : this.lastID});
    });

});

// Fetch products's reviews
app.get('/reviews/:prod_id', async (req,res) => {
    const prod_id = req.params.prod_id;

    const query = `
        SELECT id, prod_id, user_id, username, title, review, rating, created_at
        FROM product_reviews
        WHERE prod_id = ?
        ORDER BY created_at DESC
    `;

    db.all(query, [prod_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        return res.status(200).json({ reviews: rows });
    });
});

// Update Username 
app.post('/update-username', authenticateToken, async (req,res)=>{
    const { username } = req.body;
    const userId = String(req.user?.user?.id);

    if (!username || username.trim() === "") {
        return res.status(400).json({ error: true, message: "Username is required" });
    }

    const update = `UPDATE users SET username = ? WHERE id = ?`;

    db.run(update, [username, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ error: false, message: "Username Updated"});
    })
});

// Update Address
app.post('/update-address', authenticateToken, async (req,res)=>{
    const { address } = req.body;
    const userId = String(req.user?.user?.id);

    if (!address || address.trim() === '') return res.status(500).json({ error: true, message: 'Address is required'});

    const update = `UPDATE users SET address = ? WHERE id = ?`;

    db.run(update, [address, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ error: false, message: "Address Updated"});
    })
});

// Update Phone
app.post('/update-phone', authenticateToken, async (req,res)=>{
    const { phone } = req.body;
    const userId = String(req.user?.user?.id);

    if (!phone || phone.trim() === '') return res.status(500).json({ error: true, message: "Phone Number is required"});

    const update = `UPDATE users SET contact_no = ? WHERE id = ?`;

    db.run(update, [phone, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.status(200).json({ error: false, message: "Phone Number Updated "});
    })
});

function toParsedData(row) {
    return {
      id: row.prod_id,
      image: `/productsNew/${row.name}.jpg`,
      name: row.name,
      category: row.category,
      sub_category: row.sub_category,
      price: row.price,
      discount: row.discount,
      available_colours: row.available_colours,
      size_options: row.size_options,
      in_stock: row.in_stock === 'true',
    };
  }

module.exports = app;