import { Request, Response } from "express";
import * as express from "express";
import * as bookingsData from "../data/bookings";
export const bookingRoutes = express.Router();

bookingRoutes.post(
  "/:bookingId/cancel",
  async (req: Request, res: Response) => {
    console.log("POST /bookings/:bookingId/cancel");
    const bookingId = req.params.bookingId;

    const booking = await bookingsData.getBooking(bookingId);
    if (booking === null) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }
    if (booking.status === "CANCELLED") {
      res.status(400).json({ message: "Booking already cancelled" });
      return;
    }

    try {
      await bookingsData.cancelBooking(bookingId);
    } catch (e) {
      res.status(500).json({ message: e });
      return;
    }

    const cancelledBooking = await bookingsData.getBooking(bookingId);

    res.json({
      message: "Booking cancelled successfully",
      booking: cancelledBooking,
    });
  }
);
