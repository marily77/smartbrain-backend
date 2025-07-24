const PAT = '607d4ab3a8784488848793f176e51b0f';
const USER_ID = 'marily77';
const APP_ID = 'MyFirstReactApp';
const WORKFLOW_ID = 'Workflow_1';
const fetch = require('node-fetch');

// 🧠 This updates the user entry count in the DB
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
     res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
};

// 📷 This sends the image to Clarifai
const handleApiCall = (req, res) => {
  console.log("📥 Received input:", req.body.input);
  const imageUrl = req.body.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl
          }
        }
      }
    ]
  });

  fetch(`https://api.clarifai.com/v2/workflows/${WORKFLOW_ID}/results`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT,
      'Content-Type': 'application/json'
    },
    body: raw
  })
    .then(data => data.json())
    .then(response => {
      console.log('✅ Workflow response:', JSON.stringify(response, null, 2));
      res.json(response);
    })
    .catch(err => {
      console.error('❌ Clarifai API error:', err);
      res.status(400).json('unable to work with API');
    });
};

// ✅ Export both functions
module.exports = {
  handleApiCall,
  handleImage
};






