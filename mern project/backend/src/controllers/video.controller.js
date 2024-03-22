import { asyncHandler } from "../utils/asyncHandler.js";

const videoController = asyncHandler(async (req, res) => {
  res.status(200).json({
    id: 1,
    name: "Akash",
  });
});

export { videoController }
