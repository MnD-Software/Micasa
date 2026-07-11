const fallbackWhatsappNumber = "254715410023";

export function getBookingWhatsappNumber() {
  const configuredNumber = process.env.NEXT_PUBLIC_BOOKING_WHATSAPP?.replace(/\D/g, "") ?? "";

  return configuredNumber.length >= 10 ? configuredNumber : fallbackWhatsappNumber;
}

export function createWhatsappHref(message: string) {
  return `https://wa.me/${getBookingWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}
