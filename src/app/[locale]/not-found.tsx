import Link from "next/link";
import { Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <div className="font-display text-8xl font-black text-signal">404</div>
        <p className="mt-4 text-mist">Pièce introuvable — même en Chine.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-signal px-5 py-3 text-sm font-semibold text-white">← World Auto</Link>
      </div>
    </Container>
  );
}
