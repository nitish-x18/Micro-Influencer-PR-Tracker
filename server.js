const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Test route — we will remove this later
app.get('/api/test', (req, res) => {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Backend is running!', dbResult: results[0].result });
    });
});
app.get('/api/deadlines', (req, res) => {
    db.query(
        `SELECT 
            deadline_id,
            package_id,
            platform,
            DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
            completed
         FROM content_deadlines`,
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});
app.get('/api/packages', (req, res) => {
    db.query(
        `SELECT 
            package_id,
            influencer_id,
            product_name,
            product_value,
            status,
            shipped_date,
            delivery_date
         FROM packages`,
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(results);
        }
    );
});
app.get('/api/users', (req, res) => {
    db.query(
        `SELECT 
            user_id,
            name,
            email,
            role,
            created_at
         FROM users`,
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(results);
        }
    );
});
   
app.get('/api/influencers', (req, res) => {
    db.query(
        `SELECT
            influencer_id,
            name,
            instagram_handle,
            email,
            follower_count,
            niche,
            created_at
         FROM influencers`,
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});
app.get('/api/hello', (req, res) => {
    res.json({ message: "HELLO FROM THIS SERVER" });
});
const PORT =process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});