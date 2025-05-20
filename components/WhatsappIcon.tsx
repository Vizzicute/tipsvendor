import React from "react";

const WhatsappIcon = ({ size }: { size?: number }) => (
  <img
    src="/whatsapp.svg"
    alt="WhatsApp"
    width={!size ? 24 : size}
    height={!size ? 24 : size}
  />
);

export default WhatsappIcon;
