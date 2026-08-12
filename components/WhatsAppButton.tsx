import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5492216813359"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current stroke-none" />
    </a>
  );
}