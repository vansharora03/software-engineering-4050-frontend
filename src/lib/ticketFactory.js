export class TicketFactory {
    static createTicket({ bookingId, ticketType, seatNumber, showtime }) {
      if (!bookingId || !ticketType || !seatNumber || !showtime) {
        throw new Error("Invalid ticket parameters");
      }
  
      return {
        bookingId,
        ticketType,
        seatNumber,
        showtime,
        createdAt: new Date().toISOString(),
      };
    }
}

  