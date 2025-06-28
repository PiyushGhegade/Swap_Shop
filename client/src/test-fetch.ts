fetch("/api/listings")
  .then(res => {
    if (!res.ok) throw new Error("Not OK");
    return res.json();
  })
  .then(data => console.log("✅ Test Fetch Listings:", data))
  .catch(err => console.error("❌ Test Fetch Failed:", err));
