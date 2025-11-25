export const getIndiamartLeadData = async (req, res) => {
  try {
    console.log(req.body);
    res.send();
  } catch (error) {
    console.error("Error in Indiamart webhook:", error);
    return res.status(500).json({
      error: "Failed to process Indiamart webhook",
      details: error?.message || error,
    });
  }
};
