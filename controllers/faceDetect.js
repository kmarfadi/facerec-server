// clarifaiController.js
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + '1773941d953a4cbaa8aa1ff30bd960bf');

// Function that will be called by the endpoint
const detectFace = (req, res) => {
  const { imageUrl } = req.body;

  // Post model outputs request to Clarifai
  stub.PostModelOutputs(
    {
      user_app_id: { user_id: "clarifai", app_id: "main" },
      model_id: "face-detection",
      inputs: [{ data: { image: { url: imageUrl, allow_duplicate_url: true } } }]
    },
    metadata,
    (err, response) => {
      if (err) return res.status(500).json({ error: err });

      if (response.status.code !== 10000) {
        return res.status(400).json({ error: "Post model outputs failed" });
      }

      const regions = response.outputs[0].data.regions;
      res.json({ regions });
    }
  );
};

module.exports = { detectFace };
