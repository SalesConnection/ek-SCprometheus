const express = require("express");
const {
  Counter,
  Histogram,
  Gauge,
  register,
  collectDefaultMetrics,
} = require("prom-client");

const app = express();
const port = 8080;

// Define custom Prometheus metrics
const button1Counter = new Counter({
  name: "button1_clicks_total",
  help: "Total number of clicks for Button 1",
});

const button2Counter = new Counter({
  name: "button2_clicks_total",
  help: "Total number of clicks for Button 2",
});

const button3Counter = new Counter({
  name: "button3_clicks_total",
  help: "Total number of clicks for Button 3",
});

const buttonClicksHistogram = new Histogram({
  name: "button_clicks_histogram",
  help: "Histogram of button clicks over time",
  labelNames: ["button_name"],
  buckets: [1, 5, 10, 20, 30, 60], // Define histogram buckets (in seconds)
});

const buttonButtonHistogram = new Histogram({
  name: "button_button_histogram",
  help: "Histogram of button clicks over time",
  labelNames: ["button_name"],
  buckets: [1, 2, 3], // Define histogram buckets (in seconds)
});

const buttonClicksGauge = new Gauge({
  name: "button_clicks_gauge",
  help: "Total number of clicks for each button",
  labelNames: ["button_name"],
});

// Collect default metrics
collectDefaultMetrics();

// Endpoint for Button 1 click
app.post("/button1", (req, res) => {
  button1Counter.inc();
  buttonClicksHistogram.labels("Button 1").observe(1);
  buttonButtonHistogram.labels("holla1").observe(1);
  buttonClicksGauge.labels("Button 1").inc();
  res.sendStatus(200);
});

// Endpoint for Button 2 click
app.post("/button2", (req, res) => {
  button2Counter.inc();
  buttonClicksHistogram.labels("Button 2").observe(1);
  buttonButtonHistogram.labels("holla2").observe(1);
  buttonClicksGauge.labels("Button 2").inc();
  res.sendStatus(200);
});

// Endpoint for Button 3 click
app.post("/button3", (req, res) => {
  button3Counter.inc();
  buttonClicksHistogram.labels("Button 3").observe(1);
  buttonButtonHistogram.labels("holla3").observe(1);
  buttonClicksGauge.labels("Button 3").inc();
  res.sendStatus(200);
});

// Expose Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  const metrics = await register.metrics(); // Wait for the Promise to resolve
  res.end(metrics); // Send the metrics in the response
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
