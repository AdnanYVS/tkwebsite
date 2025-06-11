
module.exports = {
  apps: [
    {
      name: "tarim-kafasi",
      cwd: "/home/adnanserhadyavas/tkwebsite",
      script: "npx",
      args: "serve -s dist",
      interpreter: "none",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
