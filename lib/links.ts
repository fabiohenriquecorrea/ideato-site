export const instagramUrl = (handle: string) => `https://instagram.com/${handle.replace(/^@/, "")}`;
export const instagramDm = (handle: string) => `https://ig.me/m/${handle.replace(/^@/, "")}`;
export const whatsappUrl = (n: string) => (n ? `https://wa.me/${n.replace(/\D/g, "")}` : "");
