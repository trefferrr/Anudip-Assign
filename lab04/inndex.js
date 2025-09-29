function readData(callback) {
  const fileExists = true; 

  setTimeout(() => {
    if (fileExists) {
      const content = "This is file content";
      callback(null, content); 
    } else {
      callback("Error: File does not exist", null); 
    }
  }, 2000);
}


readData((err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("File Content:", data);
  }
});

function fetchData(url, callback) {
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      const response = { data: "Sample Data" };
      callback(null, response);
    } else {
      callback("Network Error", null);
    }
  }, 2000);
}


fetchData("https://example.com", (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Fetched Response:", response);
  }
});
