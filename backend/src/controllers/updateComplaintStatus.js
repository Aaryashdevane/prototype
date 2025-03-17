// Update complaint status (MC dashboard usage)
const updateComplaintStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const complaint = await Complaint.findById(id);
      if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  
      complaint.status = status;
      await complaint.save();
  
      res.json({ message: "Status updated successfully", complaint });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  